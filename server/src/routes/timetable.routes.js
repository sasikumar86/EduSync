const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.class) filter.class = req.query.class;
        if (req.query.day) filter.day = req.query.day;
        const timetables = await Timetable.find(filter)
            .populate('class', 'name section')
            .populate({ path: 'periods.subject', select: 'name code' })
            .populate({ path: 'periods.teacher', populate: { path: 'user', select: 'name' } })
            .sort('day');
        res.json({ success: true, data: timetables });
    } catch (error) { next(error); }
});

router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const timetable = await Timetable.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: timetable });
    } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!timetable) return res.status(404).json({ success: false, message: 'Timetable not found' });
        res.json({ success: true, data: timetable });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
