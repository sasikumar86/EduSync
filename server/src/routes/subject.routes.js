const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.class) filter.class = req.query.class;
        const subjects = await Subject.find(filter)
            .populate('class', 'name section')
            .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
            .sort('name');
        res.json({ success: true, count: subjects.length, data: subjects });
    } catch (error) { next(error); }
});

router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const subject = await Subject.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: subject });
    } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
        res.json({ success: true, data: subject });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
