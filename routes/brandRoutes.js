const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const Defect = require('../models/Defect');

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

// Add new brand in system
// POST /api/brands
router.post('/', async (req, res) => {
  try {
    const { name, image, possibleRamStorageComb, defects } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: 'Brand already exists' });
    }
    // Find matching defect docs
    const defectDocs = await Defect.find({ name: { $in: defects } });

    // Extract only their ObjectIds
    const defectIds = defectDocs.map(d => d._id);

    const new_brand = new Brand({
      name,
      image,
      possibleRamStorageComb,
      defects: defectIds
    })
    await new_brand.save();
    res.status(201).json({
      message: 'Brand created successfully',
      brand: new_brand
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
