const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const Brand = require('../models/Brand');
const Defect = require('../models/Defect')

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


// POST /api/models/calculate-defects-price
// Request body: { defects: ["defectName1", "defectName2", ...], modelId: "...", ramStorage: "..." }
router.post('/calculate-defects-price', async (req, res) => {
  try {
    const { defects, modelId, ramStorage } = req.body;
    if (!Array.isArray(defects) || !modelId) {
      return res.status(400).json({ error: 'defects (array) and modelId are required' });
    }

    // Load the model and populate all relevant defect arrays
    const model = await Model.findById(modelId)
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

    // Combine all defect-price arrays in the model into one array
    const defectArrays = [
      model.enquiryQuestions,
      model.bodyDefects,
      model.brokenScratchDefects,
      model.screenDefects,
      model.scarctchesBodyDefect,
      model.devicePanelMissing,
      model.functionalDefects,
      model.availableAccessories
    ];

    let totalDefectPrice = 0;
    let matchedDefects = [];

    for (const defectName of defects) {
      let found = false;

      // Search each defect-price array for this defect name
      for (const arr of defectArrays) {
        const match = arr.find(entry => entry.defect && entry.defect.name === defectName);
        if (match) {
          matchedDefects.push({
            defectName: defectName,
            price: match.price
          });
          const priceValue = parseFloat(match.price);
          if (!isNaN(priceValue)) {
            totalDefectPrice += priceValue;
          }
          found = true;
          break;
        }
      }
      if (!found) {
        matchedDefects.push({
          defectName,
          price: null,
          error: 'Defect not found on this model'
        });
      }
    }

    // Get price based on RAM/Storage if necessary
    let ramStoragePrice = 0;
    if (ramStorage && Array.isArray(model.ramStorageComb)) {
      const ramStorageEntry = model.ramStorageComb.find(comb => comb.ramStorage === ramStorage);
      if (ramStorageEntry && ramStorageEntry.price) {
        const ramStorageVal = parseFloat(ramStorageEntry.price);
        if (!isNaN(ramStorageVal)) {
          ramStoragePrice = ramStorageVal;
        }
      }
    }

    // Subtract totalDefectPrice from ramStoragePrice as per new requirement
    const calculatedTotalPrice = ramStoragePrice - totalDefectPrice;

    res.json({
      totalPrice: calculatedTotalPrice,
      defects: matchedDefects,
      ramStoragePrice,
      totalDefectPrice
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
