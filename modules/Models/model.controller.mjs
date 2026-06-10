import Model from './Model.mjs';
import Brand from '../Brands/Brand.mjs';
import moment from 'moment';
import Defect from '../Defects/Defect.mjs';

/**
 * GET /api/models
 */

const WARRANTY = {
  "Below 3 months": 0,
  "3 months - 6 months": 10,
  "6 months - 11 months": 15,
  "Above 11 months": 20,
  "None": 20
}

export const getModels = async (req, res) => {
  try {
    const { brand_name, name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };;
    }
    if (brand_name) {
      let brandDoc = await Brand.findOne({ name: brand_name });

      if (brandDoc) {
        filter.brand = brandDoc._id;
      }
    }
    console.log("filter", filter)
    const models = await Model.find(filter)
      // exclude images from Model
      .select("-image")
      // populate brand (if it has image, exclude them too)
      .populate({
        path: "brand",
        // select: "name",
      })
      // populate defects and exclude image from each defect
      .populate({
        path: "enquiryQuestions.defect",
        // select: "question description",
      })
      .populate({
        path: "warranty.defect",
      })
      .populate({
        path: "bodyDefects.defect",
        // select: "name",
      })
      .populate({
        path: "brokenScratchDefects.defect",
        // select: "name",
      })
      .populate({
        path: "screenDefects.defect",
        // select: "name",
      })
      .populate({
        path: "scrachesBodyDefect.defect",
        // select: "name",
      })
      .populate({
        path: "devicePanelMissing.defect",
        // select: "name",
      })
      .populate({
        path: "functionalDefects.defect",
        // select: "name",
      })
      .populate({
        path: "availableAccessories.defect",
        // select: "name",
      });

    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getModelsList = async (req, res) => {
  try {
    const { brand_name, name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };;
    }
    if (brand_name) {
      let brandDoc = await Brand.findOne({ name: brand_name });

      if (brandDoc) {
        filter.brand = brandDoc._id;
      }
    }
    console.log("filter", filter)
    const models = await Model.find(filter)
      // exclude images from Model
      .select("-image")
      // populate brand (if it has image, exclude them too)
      .populate({
        path: "brand",
        select: "name",
      })
      // populate defects and exclude image from each defect
      .populate({
        path: "enquiryQuestions.defect",
        select: "-image"
      })
      .populate({
        path: "warranty.defect",
      })
      .populate({
        path: "bodyDefects.defect",
        select: "name",
      })
      .populate({
        path: "brokenScratchDefects.defect",
        select: "name",
      })
      .populate({
        path: "screenDefects.defect",
        select: "name",
      })
      .populate({
        path: "scrachesBodyDefect.defect",
        select: "name",
      })
      .populate({
        path: "devicePanelMissing.defect",
        select: "name",
      })
      .populate({
        path: "functionalDefects.defect",
        select: "name",
      })
      .populate({
        path: "availableAccessories.defect",
        select: "name",
      });

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
      .populate('warranty.defect')
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
      return res.status(400).json({
        error: "defects (array) and modelId are required"
      });
    }

    const model = await Model.findById(modelId)
      .populate("enquiryQuestions.defect")
      .populate("warranty.defect")
      .populate("bodyDefects.defect")
      .populate("brokenScratchDefects.defect")
      .populate("screenDefects.defect")
      .populate("scrachesBodyDefect.defect")
      .populate("devicePanelMissing.defect")
      .populate("functionalDefects.defect")
      .populate("availableAccessories.defect");

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    const defectArrays = [
      model.enquiryQuestions || [],
      model.warranty || [],
      model.bodyDefects || [],
      model.brokenScratchDefects || [],
      model.screenDefects || [],
      model.scrachesBodyDefect || [],
      model.devicePanelMissing || [],
      model.functionalDefects || [],
      model.availableAccessories || []
    ];

    let totalDefectPrice = 0;
    let matchedDefects = [];
    let ramStoragePrice = 0;

    // ✅ Get base price from RAM/Storage
    if (ramStorage && Array.isArray(model.ramStorageComb)) {
      const entry = model.ramStorageComb.find(
        comb => comb.ramStorage === ramStorage
      );
      if (entry?.price) {
        ramStoragePrice = Number(entry.price) || 0;
      }
    }

    // 🔥 STEP 1: deadMobile override
    if (defects.includes("deadMobile")) {
      for (const arr of defectArrays) {
        const match = arr.find(
          entry => entry.defect?.name === "deadMobile"
        );

        if (match) {
          const deadPrice = Number(match.price) || 0;

          return res.json({
            totalPrice: deadPrice,
            totalDefectPrice: deadPrice,
            defects: [{
              defectName: "deadMobile",
              price: deadPrice
            }],
            deadMobileApplied: true
          });
        }
      }

      return res.status(400).json({
        error: "deadMobile defect not configured for this model"
      });
    }

    // 🔥 STEP 2: Process defects
    let warrantyPercent = 0;
    let warrantyFound = false;

    for (const defectName of defects) {

      // ✅ Warranty handling
      if (WARRANTY.hasOwnProperty(defectName)) {
        const percent = Number(WARRANTY[defectName]) || 0;

        // take max warranty benefit
        warrantyPercent = Math.max(warrantyPercent, percent);
        warrantyFound = true;

        matchedDefects.push({
          defectName,
          percent,
          type: "warranty"
        });

        continue;
      }

      // ✅ Normal defects
      let found = false;

      for (const arr of defectArrays) {
        const match = arr.find(
          entry => entry.defect?.name === defectName
        );

        if (match) {
          const priceValue = Number(match.price) || 0;

          matchedDefects.push({
            defectName,
            price: priceValue
          });

          totalDefectPrice += priceValue;
          found = true;
          break;
        }
      }

      if (!found) {
        matchedDefects.push({
          defectName,
          price: null,
          error: "Defect not found on this model"
        });
      }
    }

    // 🔥 STEP 3: Apply warranty ONCE

    if (!warrantyFound) {
      warrantyPercent = Number(WARRANTY["Above 11 months"]); // 20%
    }
    
    const warrantyPrice = Math.round(
      ramStoragePrice * (1 - warrantyPercent / 100)
    );

    // 🔥 STEP 4: Final price
    const totalPrice = warrantyPrice - totalDefectPrice;

    return res.json({
      basePrice: ramStoragePrice,
      warranty: {
        percent: warrantyPercent,
        priceAfterWarranty: warrantyPrice
      },
      totalDefectPrice,
      totalPrice,
      defects: matchedDefects,
      deadMobileApplied: false
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
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
      warranty = [],
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
      return res.status(400).json({ error: "Model already exists" });
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

    // Helper to convert incoming defect (by name) to { defect: ObjectId, price }
    const mapDefectsByName = async (arr) => {
      const mapped = [];

      for (const d of arr) {
        const defectName = d.defect?.trim();
        if (!defectName) continue;

        const defectDoc = await Defect.findOne({
          name: { $regex: new RegExp("^" + defectName + "$", "i") },
        });

        if (defectDoc) {
          mapped.push({
            defect: defectDoc._id,
            price: d.price ?? "",
          });
        } else {
          console.warn(`Defect not found: ${defectName}`);
        }
      }

      return mapped;
    };

    // 2 — Convert all incoming defect names to IDs
    const modelData = {
      name,
      image,
      ramStorageComb,
      brand: brandDoc._id,
      enquiryQuestions: await mapDefectsByName(enquiryQuestions),
      warranty: await mapDefectsByName(warranty),
      bodyDefects: await mapDefectsByName(bodyDefects),
      brokenScratchDefects: await mapDefectsByName(brokenScratchDefects),
      screenDefects: await mapDefectsByName(screenDefects),
      scrachesBodyDefect: await mapDefectsByName(scrachesBodyDefect),
      devicePanelMissing: await mapDefectsByName(devicePanelMissing),
      functionalDefects: await mapDefectsByName(functionalDefects),
      availableAccessories: await mapDefectsByName(availableAccessories),
    };

    // 3 — Save model
    const newModel = new Model(modelData);
    const savedModel = await newModel.save();

    res
      .status(201)
      .json({ success: true, message: "Model created", data: savedModel });
  } catch (error) {
    console.error("Add Model Error:", error);
    res
      .status(500)
      .json({ error: "Internal server error" });
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


export const getModelNameAndId = async (req, res) => {
  try {
    const { brand_name, name } = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (brand_name) {
      const brandDoc = await Brand.findOne({
        name: { $regex: new RegExp("^" + brand_name + "$", "i") }
      });

      if (brandDoc) {
        filter.brand = brandDoc._id;
      } else {
        return res.json([]);

      }
    }

    const models = await Model.find(filter)
      .select("_id name")
      .sort({ name: 1 });


    res.json(models);
    console.log('models: ', models);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




