const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users(USER, ADMIN) with filters
// GET /api/users?role=USER
// router.get('/', async (req, res) => {
//   try {
//     const { role, plan } = req.query;

//     let filter = {};

//     if (plan) {
//       const existing_plan = await SubscriptionPlan.find({ name: { $regex: plan, $options: 'i' } });
//       filter.plans = existing_plan._id;
//     }

//     if (role) filter.role = role;

//     const users = await User.find(filter);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { contact_number, password } = req.body;
    const user = await User.findOne({ contact_number });
    if (user) {
      if (password === user.password) {
        res.json(user);
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ message: 'User not found' });
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// // GET /api/users/:id - get a single user
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// PUT /api/users/:id - update a single user
// router.put('/:id', async (req, res) => {
//   const ALLOWED_UPDATES = [
//     'name',
//     'profile_pic',
//     'firm_name',
//     'address',
//     'language',
//     'gender',
//     'designation',
//     'DOB',
//     'email_id',
//     'subscription_details',
//     'user_template_details'
//   ];
//   const updates = req.body;
//   const id = req.params.id;

//   // Sanitize / filter only allowed fields
//   const updateData = {};
//   for (const key of ALLOWED_UPDATES) {
//     if (updates[key] !== undefined) {
//       updateData[key] = updates[key];
//     }
//   }

//   if (Object.keys(updateData).length === 0) {
//     // Nothing to update
//     return res.status(400).json({ error: 'No valid fields provided for update' });
//   }

//   try {
//     const user = await User.findByIdAndUpdate(
//       id,
//       updateData
//     );

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     return res.json(user);
//   } catch (err) {
//     console.error('Error updating user:', err);
//     return res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
