const express = require('express');
const router = express.Router();
const School = require('../models/School');
const { protect, authorize } = require('../middleware/auth');

// GET /api/schools — List all schools (superadmin only)
router.get('/', protect, authorize('superadmin'), async (req, res, next) => {
    try {
        const schools = await School.find().sort('-createdAt');
        res.json({ success: true, count: schools.length, data: schools });
    } catch (error) { next(error); }
});

// GET /api/schools/:id
router.get('/:id', protect, async (req, res, next) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        res.json({ success: true, data: school });
    } catch (error) { next(error); }
});

// POST /api/schools — Create school
router.post('/', protect, authorize('superadmin'), async (req, res, next) => {
    try {
        const school = await School.create(req.body);
        res.status(201).json({ success: true, data: school });
    } catch (error) { next(error); }
});

// PUT /api/schools/:id
router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        res.json({ success: true, data: school });
    } catch (error) { next(error); }
});

// DELETE /api/schools/:id
router.delete('/:id', protect, authorize('superadmin'), async (req, res, next) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
