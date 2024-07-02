const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const mongoose = require('mongoose');

exports.createUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      mobile
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}


exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.searchUser = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ msg: 'Please provide a search term' });
  }

  try {
    const regex = new RegExp(name, 'i'); // 'i' flag makes the search case-insensitive
    const users = await User.find({ name: regex });

    if (!users.length) {
      return res.status(404).json({ msg: 'No users found' });
    }

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.followUser = async (req, res) => {
  const { userIdToFollow } = req.body;
  const userId = req.user.id; // Assuming userId is obtained from authentication middleware

  try {
    if (userId === userIdToFollow) {
      return res.status(400).json({ msg: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ msg: 'User to follow not found' });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ msg: 'Current user not found' });
    }

    if (currentUser.followees.includes(userIdToFollow)) {
      return res.status(400).json({ msg: 'Already following this user' });
    }

    currentUser.followees.push(userIdToFollow);
    userToFollow.followers.push(userId);

    await currentUser.save();
    await userToFollow.save();

    res.json({ msg: 'User followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
