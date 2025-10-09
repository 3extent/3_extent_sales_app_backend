const express = require('express');
const router = express.Router();
const Model = require('../models/Model');

// Get all models with filters
// GET /api/models?name=SAMSUNG
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;

    let filter = {};
    if (name) {
      filter.name = name;
    }
    const models = await Model.find(filter);
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
