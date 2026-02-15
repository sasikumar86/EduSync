const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role, schoolId, phone } = req.body;
        const user = await User.create({ name, email, password, role, schoolId, phone });
        const token = user.getSignedJwtToken();
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, schoolId: user.schoolId } });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        user.lastLogin = new Date();
        await user.save({ validateModifiedOnly: true });

        const token = user.getSignedJwtToken();

        // Get role-specific profile
        let profile = null;
        if (user.role === 'student') {
            profile = await Student.findOne({ user: user._id }).populate('class');
        } else if (user.role === 'teacher' || user.role === 'schooladmin') {
            profile = await Staff.findOne({ user: user._id });
        }

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                phone: user.phone,
                avatar: user.avatar,
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/auth/me
const { protect } = require('../middleware/auth');
router.get('/me', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        let profile = null;
        if (user.role === 'student') {
            profile = await Student.findOne({ user: user._id }).populate('class');
        } else if (['teacher', 'schooladmin'].includes(user.role)) {
            profile = await Staff.findOne({ user: user._id }).populate('classesAssigned subjectsAssigned');
        }
        res.json({ success: true, user: { ...user.toObject(), profile } });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
