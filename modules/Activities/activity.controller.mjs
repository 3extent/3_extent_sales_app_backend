import Model from "../Models/Model.mjs";
import User from "../Users/User.mjs";
import Activity from "./Activity.mjs";
import Defect from "../Defects/Defect.mjs";
import Partner from "../Partners/Partner.mjs";

export const getActivitiess = async (req, res) => {
  try {
    const { contact_number, model_name, selected_ram_storage, partner_name, assigned_to, status, partner_id, } = req.query;
    let filter = {};

    if (selected_ram_storage) {
      filter.selected_ram_storage = selected_ram_storage;
    }
   
    if (status) {
      if (status === "PENDING FOR APPROVAL") {
        filter.status = {
          $in: ["PENDING", "APPROVAL_PENDING"]
        };
      } else {
        filter.status = status;
      }
    }

    if (model_name) {
      let modelDoc = await Model.findOne({ name: { $regex: model_name, $options: 'i' } });
      if (modelDoc) {
        filter.model = modelDoc._id;
      }
    }
    if (contact_number) {
      let userDoc = await User.findOne({ contact_number: { $regex: contact_number, $options: 'i' } }).populate({ path: 'role' })
        .populate({ path: 'partner' });;
      if (userDoc) {
        filter.user = userDoc._id;
      }
    }
    if (assigned_to) {
      let userDoc = await User.findOne({ name: { $regex: assigned_to, $options: 'i' } }).populate({ path: 'role' })
        .populate({ path: 'partner' });;
      if (userDoc) {
        filter.assigned_to = userDoc._id;
      }
    }

    if (partner_id) {
      const users = await User.find({
        partner: partner_id
      });

      const userIds = users.map(
        (user) => user._id
      );

      filter.user = {
        $in: userIds
      };
    }

    if (partner_name) {
      let partnerDoc = await Partner.findOne({ name: { $regex: partner_name, $options: 'i' } });
      if (partnerDoc) {
        const users = await User.find({ partner: partnerDoc._id }).populate({ path: 'role' })
          .populate({ path: 'partner' });
        const userIds = users.map(u => u._id);
        if (userIds) {
          filter.user = { $in: userIds };
        }
      }
    }

    const activities = await Activity.find(filter)
      .populate('model')     // populate model details
      .populate('defects')   // populate defects
      .populate({
        path: 'user',        // populate the user field
        populate: [
          { path: 'role' },      // populate nested role on user
          { path: 'partner' }    // populate nested partner on user
        ]
      })
      .exec();

    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: err.message });
  }
};

export const addActivity = async (req, res) => {
  try {
    const { contact_number, model, defects, final_price, add_on_amount, ramStorage, selected_address, status } = req.body;

    const user = await User.findOne({ contact_number }).populate({ path: 'role' })
      .populate({ path: 'partner' });;
    if (user) {
      // Create a new activity (excluding contact_number)

      // Load the model and populate all relevant defect arrays
      const existingModel = await Model.findById(model);

      let ramStorageComb = existingModel.ramStorageComb.map((singleRamStorage) => singleRamStorage.ramStorage)
      if (!ramStorageComb.includes(ramStorage)) {
        return res.status(400).json({ error: 'RAM/Storage combination for this model does not found' });
      }

      // Suppose defects is an array of strings (names)
      const existingDefects = await Promise.all(
        defects.map(async (singleDefect) => {
          const def = await Defect.findOne({ name: singleDefect });
          return def ? def._id : null;  // or handle not found appropriately
        })
      );

      if (existingModel) {

        const activity = new Activity({
          model: existingModel._id,
          defects: existingDefects,
          final_price,
          add_on_amount,
          total_amount: Number(final_price) + Number(add_on_amount),
          selected_ram_storage: ramStorage,
          selected_address,
          user: user._id,
          // status: "PENDING"
          status: status || "PENDING"
        });

        await activity.save();

        // Push activity id into user's activities array (add this field to schema if not present)
        if (!user.activities) user.activities = [];
        user.activities.push(activity._id);
        await user.save();

        res.json({
          message: 'Activity created and user updated',
          activityId: activity._id,
          userId: user._id
        });
      }
    } else {
      return res.status(400).json({ error: 'User not found' });
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * PATCH /api/activity/:activityId/status
 */
export const updateActivityStatus = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { status, assigned_to, final_price } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "status is required"
      });
    }

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        error: "Activity not found"
      });
    }

    // Optional assigned_to validation
    if (assigned_to) {
      const assignedUser = await User.findById(assigned_to);

      if (!assignedUser) {
        return res.status(404).json({
          error: "Assigned user not found"
        });
      }

      activity.assigned_to = assigned_to;
    }
    if (final_price !== undefined) {
      activity.final_price = Number(final_price);

      activity.total_amount =
        Number(final_price) +
        Number(activity.add_on_amount || 0);
    }

    activity.status = status;

    await activity.save();

    return res.json({
      message: "Activity status updated successfully",
      activityId: activity._id,
      status: activity.status,
      final_price: activity.final_price,
      total_amount: activity.total_amount,
      assigned_to: activity.assigned_to || null
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};