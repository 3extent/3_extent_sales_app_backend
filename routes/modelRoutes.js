const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const Brand = require('../models/Brand');
const Defect=require('../models/Defect')

// Get all models with filters
// GET /api/models?name=SAMSUNG
router.get('/', async (req, res) => {
  try {
    const { brand_name } = req.query;

    let filter = {};


    let brandDoc = await Brand.findOne({ name: brand_name });
    console.log("brandDoc", brandDoc)

    if (brandDoc) {
      filter.brand = brandDoc._id;
    }
    console.log("filter", filter)

    const models = await Model.find(filter).populate('brand')
      .populate('enquiryQuestions.defect')
      .populate('bodyDefects.defect')
      .populate('brokenScratchDefects.defect')
      .populate('screenDefects.defect')
      .populate('scarctchesBodyDefect.defect')
      .populate('devicePanelMissing.defect')
      .populate('functionalDefects.defect')
      .populate('availableAccessories.defect');
    console.log("models", models)

    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single model by id
// GET /api/models/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id || !require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid model id' });
    }

    const model = await Model.findById(id)
      .populate('brand')
      .populate('enquiryQuestions.defect')
      .populate('bodyDefects.defect')
      .populate('brokenScratchDefects.defect')
      .populate('screenDefects.defect')
      .populate('scarctchesBodyDefect.defect')
      .populate('devicePanelMissing.defect')
      .populate('functionalDefects.defect')
      .populate('availableAccessories.defect');

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
