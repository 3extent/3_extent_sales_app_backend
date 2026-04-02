import User from './User.mjs';
import moment from "moment";
import jwt from "jsonwebtoken";

import twilio from 'twilio';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';
import UserRole from '../UserRoles/UserRole.mjs';

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { contact_number, otp = "1234", is_new, name } = req.body;

    const user = await User.findOne({ contact_number })
      .populate({ path: 'role' })
      .populate({ path: 'partner' });
    console.log('user: ', user);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }


    if (otp !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Expiry check
    if (!user.otp_expires_at || moment().valueOf() > user.otp_expires_at) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP after successful login
    user.otp = null;
    user.otp_expires_at = null;

    if (is_new) {
      user.name = name;
    }

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role?._id,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


export const sendOtp = async (req, res) => {
  try {
    // console.log('req.body: ', req.body);
    const { contact_number } = req.body;

    if (!contact_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    const otpExpiry = moment().add(5, 'minutes').valueOf(); // 5 min
    console.log('otpExpiry: ', otpExpiry);

    let user = await User.findOne({ contact_number }).populate({ path: 'role' })
      .populate({ path: 'partner' });
    console.log('user: ', user);
    let is_new = false;

    if (!user) {
      // 🆕 Create new user
      const userRole = await UserRole.findOne({ name: "USER" })
      user = await User.create({
        contact_number,
        otp,
        otp_expires_at: otpExpiry,
        role: userRole._id
      });

      is_new = true;
    } else {
      // ♻️ Existing user → update OTP
      user.otp = otp;
      user.otp_expires_at = otpExpiry;
      await user.save();
    }

    // Send OTP
    var data = {
      "to": `91${contact_number}`,
      "from": "3_EXTENT",
      "sms": `This is your OTP for Bannerwala : ${otp}`,
      "type": "plain",
      "api_key": process.env.TERMII_API_KEY,
      "channel": "generic",
    };
    var options = {
      'method': 'POST',
      'url': 'https://v3.api.termii.com/api/sms/send',
      'headers': {
        'Content-Type': ['application/json', 'application/json']
      },
      body: JSON.stringify(data)

    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });

    res.json({
      message: 'OTP sent successfully',
      is_new
    });

  } catch (err) {
    console.error('Send OTP Error:', err);
    // ♻️ Existing user → update OTP
    let user = await User.findOne({ contact_number: req.body.contact_number }).populate({ path: 'role' })
      .populate({ path: 'partner' });
    user.otp = "1234";
    const otpExpiry = moment().add(5, 'minutes').valueOf(); // 5 min
    user.otp_expires_at = otpExpiry;
    await user.save();
    res.json({
      message: 'OTP sent successfully with error',
    });
  }
};



export const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      pincode,
      flat_no,
      area,
      land_mark,
      alternate_number,
      type
    } = req.body;

    let user = await User.findById(id);
    console.log('user: ', user);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // update name
    if (name) {
      user.name = name;
    }

    // ✅ FIX HERE
    if (!user.address) {
      user.address = [];
    }

    const newAddress = {
      pincode,
      flat_no,
      area,
      land_mark,
      alternate_number,
      type
    };



    console.log('user: ', user);
    console.log(User.schema.obj.address);

    console.log('newAddress: ', typeof newAddress);
    user.address.push(newAddress);

    user.updated_at = moment.utc().valueOf();

    await user.save();

    res.json({
      message: "Name updated & Address added",
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


export const getuserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("role")
      .populate("partner");

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {

    const { role } = req.query;

    let filter = {};
    if (role) {
      const existingRole = await UserRole.findOne({ name: role });
      if (!existingRole) {
        return res.status(400).json({ message: 'User role not found' });
      }
      filter.role = existingRole._id;
    }

    const users = await User.find(filter)
      .populate("role")
      .populate("partner");

    res.json({
      message: "All users fetched",
      users
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};