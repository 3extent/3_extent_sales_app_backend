import Brand from './Brand.mjs';
import Defect from '../Defects/Defect.mjs';

export const getBrands = async (req, res) => {
  try {
    const { name, limit: limitStr, offset: offsetStr } = req.query;

    const defaultLimit = 20;

    let limit = parseInt(limitStr);
    if (isNaN(limit) || limit < 1) limit = defaultLimit;


    let offset = parseInt(offsetStr);
    if (isNaN(offset) || offset < 0) offset = 0;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    const totalCount = await Brand.countDocuments(filter);
    const brands = await Brand.find(filter).select("-image")
      .skip(offset)
      .limit(limit)
      .lean();
      
    res.json({
      data: brands,
      totalCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getBrandsNames = async (req, res) => {
  try {
    const { name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    const brands = await Brand.find(filter).select('name');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addBrands = async (req, res) => {
  try {
    const { name, image, thumbnailBase64, possibleRamStorageComb, defects } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ error: 'Brand already exists' });
    }
    // Find matching defect docs
    const defectDocs = await Defect.find({ name: { $in: defects } });

    // Extract only their ObjectIds
    const defectIds = defectDocs.map(d => d._id);

    const new_brand = new Brand({
      name,
      image,
      thumbnailBase64,
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
}