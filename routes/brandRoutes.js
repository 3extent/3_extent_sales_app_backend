const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// Get all brands with filters
// GET /api/brands?name=SAMSUNG
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    const brands = await Brand.find(filter);
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
