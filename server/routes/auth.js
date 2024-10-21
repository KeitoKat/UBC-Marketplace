const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const router = express.Router();

/**
 * POST /auth/register
 * Request body: {name, email, mobile, password}
 * Response: {message}
 * Description: Register a new user
 */
router.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!email.endsWith('ubc.ca')) {
    return res.status(400).json({ message: 'Email must end with ubc.ca' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }

    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json({ message: 'User with this mobile number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      verificationToken,
      isAdmin: false,
      isArchived: false,
    });
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      message:
        'Registration successful, please check your email to verify your account',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
});

/**
 * GET /auth/verify-email
 * Query: token
 * Response: {message}
 * Description: Verify user's email
 */
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * POST /auth/resend-verification
 * Request body: {email}
 * Response: {message}
 * Description: Resend verification email
 */
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    await sendVerificationEmail(user, user.verificationToken);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

/**
 * POST /auth/login
 * Request body: {email, password}
 * Response: {id, name, email, mobile, token, isAdmin, isArchived}
 * Description: Login user
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY');
    res.status(200).json({
      id: user._id,
      name: user.name,
      email,
      mobile: user.mobile,
      token,
      isAdmin: user.isAdmin,
      isArchived: user.isArchived,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
