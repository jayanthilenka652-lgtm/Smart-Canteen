const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isFallback, store } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smart_canteen_jwt_secret_key_2026_safe', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Student or Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    if (isFallback()) {
      const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        role: role || 'Student',
        createdAt: new Date()
      };
      store.users.push(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          token: generateToken(newUser._id)
        }
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'Student'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    if (isFallback()) {
      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            token: generateToken(user._id)
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          token: generateToken(user._id)
        }
      });
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    if (isFallback()) {
      const userIndex = store.users.findIndex(u => u._id === req.user._id || u.email === req.user.email);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const existingEmail = email ? email.trim().toLowerCase() : req.user.email;
      const duplicate = store.users.find(u => u.email.toLowerCase() === existingEmail.toLowerCase() && u._id !== req.user._id);
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another account' });
      }

      store.users[userIndex] = {
        ...store.users[userIndex],
        name: name ? name.trim() : store.users[userIndex].name,
        email: existingEmail,
        phone: phone !== undefined ? String(phone).trim() : store.users[userIndex].phone || ''
      };

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: store.users[userIndex]._id,
          name: store.users[userIndex].name,
          email: store.users[userIndex].email,
          phone: store.users[userIndex].phone,
          role: store.users[userIndex].role
        }
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another account' });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = String(phone).trim();

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
