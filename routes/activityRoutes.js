const express = require('express');
const router = express.Router();
const User = require('../models/User')
const Activity = require('../models/Activity');

// POST /api/activity/
router.post('/', async (req, res) => {
  try {
    const { contact_number, model, defects, final_price } = req.body;
    const user = await User.findOne({ contact_number });
    if (user) {
      // Create a new activity (excluding contact_number)
      
      const activity = new Activity({
        model,
        defects,
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
    } else {
      return res.status(400).json({ message: 'User not found' });
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
