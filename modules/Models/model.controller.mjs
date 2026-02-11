import Model from './Model.mjs';
import Brand from '../Brands/Brand.mjs';
import moment from 'moment';

/**
 * GET /api/models
 */
export const getModels = async (req, res) => {
  try {
    const { brand_name, name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };;
    }
    if (brand_name) {
      let brandDoc = await Brand.findOne({ name: { $regex: brand_name, $options: 'i' } });

      if (brandDoc) {
        filter.brand = brandDoc._id;
      }
    }
    console.log("filter", filter)
    const models = await Model.find(filter).populate('brand')
      .populate('enquiryQuestions.defect')
      .populate('bodyDefects.defect')
      .populate('brokenScratchDefects.defect')
      .populate('screenDefects.defect')
      .populate('scrachesBodyDefect.defect')
      .populate('devicePanelMissing.defect')
      .populate('functionalDefects.defect')
      .populate('availableAccessories.defect');
    console.log("models", models)

    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/models/:id
 */
export const getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findById(id)
      .populate('brand')
      .populate('enquiryQuestions.defect')
      .populate('bodyDefects.defect')
      .populate('brokenScratchDefects.defect')
      .populate('screenDefects.defect')
      .populate('scrachesBodyDefect.defect')
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
};

/**
 * POST /api/models/calculate-defects-price
 */
export const calculateDefectsPrice = async (req, res) => {
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
      .populate('scrachesBodyDefect.defect')
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
      model.scrachesBodyDefect,
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
};

//POST api/models

export const addModel = async (req, res) => {
  try {
    const {
      name,
      image,
      ramStorageComb,
      brand,
      enquiryQuestions = [],
      bodyDefects = [],
      brokenScratchDefects = [],
      screenDefects = [],
      scrachesBodyDefect = [],
      devicePanelMissing = [],
      functionalDefects = [],
      availableAccessories = [],
    } = req.body;

    if (!name || !brand) {
      return res.status(400).json({
        success: false,
        error: "Name and brand are required",
      });
    }
    const existingModel = await Model.findOne({ name });
    if (existingModel) {
      return res.status(400).json({ error: 'Model already exists' });
    }

    // 1 — Find brand by name
    const brandDoc = await Brand.findOne({
      name: { $regex: new RegExp("^" + brand + "$", "i") },
    });

    if (!brandDoc) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // 2 — Build model data directly
    const modelData = {
      name,
      image,
      ramStorageComb,
      brand: brandDoc._id,
      enquiryQuestions: enquiryQuestions.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      bodyDefects: bodyDefects.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      brokenScratchDefects: brokenScratchDefects.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      screenDefects: screenDefects.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      scrachesBodyDefect: scrachesBodyDefect.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      devicePanelMissing: devicePanelMissing.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      functionalDefects: functionalDefects.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
      availableAccessories: availableAccessories.map((d) => ({
        defect: d.defectId,
        price: d.price,
      })),
    };

    // 3 — Save
    const newModel = new Model(modelData);
    const savedModel = await newModel.save();

    res
      .status(201)
      .json({ success: true, message: "Model created", data: savedModel });
  } catch (error) {
    console.error("Add Model Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};


/**
 * PUT /api/models/:id
 */
export const updateModel = async (req, res) => {
  try {
    const modelId = req.params.id;

    // Prepare update object
    const updateData = { ...req.body, updated_at: moment.utc().valueOf() };

    // Update the model
    const updatedModel = await Model.findByIdAndUpdate(
      modelId,
      { $set: updateData },
      { new: true } // return updated result
    );

    if (!updatedModel) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json({
      message: "Model updated successfully",
      data: updatedModel
    });

  } catch (err) {
    console.error("Error updating model:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
