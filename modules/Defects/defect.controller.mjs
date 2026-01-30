import Defect from './Defect.mjs';

export const getDefects = async (req, res) => {
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
};