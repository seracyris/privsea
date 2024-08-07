const express = require('express');
const multer = require('multer');
const User = require('../models/user.model'); // Ensure the path is correct relative to profile.routes.js
const jwt = require('jsonwebtoken');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Adjust the path as necessary
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.put('/user/profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'MQlaYtLjqRWkHfJeGycx');
        const userId = decoded.userID;

        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        user.profilePicture = `/uploads/${req.file.filename}`; // Adjust the path as necessary
        await user.save();

        res.send({ status: 'success', user });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;