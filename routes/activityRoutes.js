const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Activity = require('../models/Activity');
const Model = require('../models/Model');
const Defect = require('../models/Defect');

// POST /api/activity/
router.post('/', async (req, res) => {
  try {
    const { contact_number, model, defects, final_price } = req.body;
    const user = await User.findOne({ contact_number });
    if (user) {
      // Create a new activity (excluding contact_number)

      // Load the model and populate all relevant defect arrays
      const existingModel = await Model.findById(model);

      const existingDefects = defects.map(async (singleDefect) => {
        return await Defect.findOne({ name: singleDefect })._id
      })

      if (existingModel) {

        const activity = new Activity({
          model: existingModel._id,
          defects: existingDefects,
          final_price,
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
});

module.exports = router;
