const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const Brand = require('../models/Brand');

// Get all models with filters
// GET /api/models?name=SAMSUNG
router.get('/', async (req, res) => {
  try {
    const { brand_name } = req.query;

    let filter = {};


    let brandDoc = await Brand.find({ name: brand_name });

    if (brandDoc) {
      filter.brand = brandDoc._id;
    }
    const models = await Model.find(filter);
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
