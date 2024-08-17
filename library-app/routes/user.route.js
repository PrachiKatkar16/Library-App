const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

// Register Route
router.post('/register', async (req, res) => {
    const { username, password, roles } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ username, password: hashedPassword, roles });
        await user.save();
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.roles }, process.env.JWT_SECRET_KEY);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
