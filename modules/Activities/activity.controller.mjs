import Model from "../Models/Model.mjs";
import User from "../Users/User.mjs";
import Activity from "./Activity.mjs";
import Defect from "../Defects/Defect.mjs";

export const getActivitiess = async (req, res) => {
  try {
    const { contact_number, model_name, selected_ram_storage, partner_name } = req.query;
    let filter = {};

    if (selected_ram_storage) {
      filter.selected_ram_storage = selected_ram_storage;
    }

    if (model_name) {
      let modelDoc = await Model.findOne({ name: { $regex: model_name, $options: 'i' } });
      if (modelDoc) {
        filter.model = modelDoc._id;
      }
    }
    if (contact_number) {
      let userDoc = await User.findOne({ contact_number: { $regex: contact_number, $options: 'i' } });
      if (userDoc) {
        filter.user = userDoc._id;
      }
    }
    if (partner_name) {
      let partnerDoc = await Partner.findOne({ name: { $regex: partner_name, $options: 'i' } });
      if (partnerDoc) {
        const users = await User.find({ partner: partnerDoc._id });
        const userIds = users.map(u => u._id);
        if (userIds) {
          filter.user = { $in: userIds };
        }
      }
    }

    const activities = await Activity.find(filter)
      .populate('model')         // populate model details
      .populate('defects').populate('user');      // populate defects array
    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: err.message });
  }
};

export const addActivity = async (req, res) => {
  try {
    const { contact_number, model, defects, final_price, add_on_amount, ramStorage } = req.body;

    const user = await User.findOne({ contact_number });
    if (user) {
      // Create a new activity (excluding contact_number)

      // Load the model and populate all relevant defect arrays
      const existingModel = await Model.findById(model);

      let ramStorageComb = existingModel.ramStorageComb.map((singleRamStorage) => singleRamStorage.ramStorage)
      if (!ramStorageComb.includes(ramStorage)) {
        return res.status(400).json({ message: 'RAM/Storage combination for this model does not found' });
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
          total_amount: parseInt(final_price) + parseInt(add_on_amount),
          selected_ram_storage: ramStorage,
          user: user._id
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
      return res.status(400).json({ message: 'User not found' });
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}