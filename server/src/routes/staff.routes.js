const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/staff
router.get('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.department) filter.department = req.query.department;
        if (req.query.status) filter.status = req.query.status;
        const staff = await Staff.find(filter)
            .populate('user', 'name email phone avatar role')
            .populate('classesAssigned', 'name section')
            .sort('-createdAt');
        res.json({ success: true, count: staff.length, data: staff });
    } catch (error) { next(error); }
});

// GET /api/staff/:id
router.get('/:id', protect, async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id)
            .populate('user', 'name email phone avatar role')
            .populate('classesAssigned', 'name section')
            .populate('subjectsAssigned', 'name code');
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, data: staff });
    } catch (error) { next(error); }
});

// POST /api/staff — Add new staff
router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const { name, email, password, phone, role, ...staffData } = req.body;
        const userRole = role === 'schooladmin' ? 'schooladmin' : 'teacher';
        const user = await User.create({ name, email, password: password || 'Staff@123', role: userRole, schoolId: req.schoolId, phone });
        const staff = await Staff.create({ ...staffData, user: user._id, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: staff });
    } catch (error) { next(error); }
});

// PUT /api/staff/:id
router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, data: staff });
    } catch (error) { next(error); }
});

// DELETE /api/staff/:id
router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
