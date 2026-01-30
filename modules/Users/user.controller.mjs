import User from './User.mjs';

import twilio from 'twilio';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

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

export const sendOtp = async (req, res) => {
  try {
    const { contact_number } = req.body;

    if (!contact_number) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    let user = await User.findOne({ contact_number });
    let isNew = false;

    if (!user) {
      // 🆕 Create new user
      user = await User.create({
        contact_number,
        otp,
        otp_expires_at: otpExpiry
      });
      isNew = true;
    } else {
      // ♻️ Existing user → update OTP
      user.otp = otp;
      user.otp_expires_at = otpExpiry;
      await user.save();
    }

    // Send OTP
    await client.messages.create({
      to: contact_number,
      from: '+16419343401',
      body: `OTP for 3_Extent is ${otp}`
    });

    res.json({
      message: 'OTP sent successfully',
      isNew
    });

  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};