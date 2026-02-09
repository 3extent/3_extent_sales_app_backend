import Partner from "./Partner.mjs";

export const getAllPartners = async (req, res) => {
  try {
    const { name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    const partners = await Partner.find(filter);
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};