const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
    try {
        const classes = await Class.find({ schoolId: req.schoolId })
            .populate('classTeacher', 'employeeId')
            .populate({ path: 'classTeacher', populate: { path: 'user', select: 'name' } })
            .sort('name');
        res.json({ success: true, count: classes.length, data: classes });
    } catch (error) { next(error); }
});

router.get('/:id', protect, async (req, res, next) => {
    try {
        const cls = await Class.findById(req.params.id).populate({ path: 'classTeacher', populate: { path: 'user', select: 'name' } });
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        res.json({ success: true, data: cls });
    } catch (error) { next(error); }
});

router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const cls = await Class.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: cls });
    } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cls) return res.status(404).json({ success: false, message: 'Class not found' });
        res.json({ success: true, data: cls });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
