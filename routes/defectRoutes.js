const express = require('express');
const router = express.Router();
const Defect = require('../models/Defect');

// Get all defects with filters
// GET /api/defects?type=
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};
    if (type) {
      filter.type = type;
    }
    const defects = await Defect.find(filter);
    res.json(defects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
