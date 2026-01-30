import User from './User.mjs';

export const loginUser = async (req, res) => {
  try {
    const { contact_number, password } = req.body;

    const user = await User.findOne({ contact_number });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
