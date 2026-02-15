const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.class) filter.class = req.query.class;
        if (req.query.type) filter.type = req.query.type;
        const exams = await Exam.find(filter)
            .populate('class', 'name section')
            .populate('subjects.subject', 'name code')
            .sort('-startDate');
        res.json({ success: true, count: exams.length, data: exams });
    } catch (error) { next(error); }
});

router.get('/:id', protect, async (req, res, next) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('class', 'name section')
            .populate('subjects.subject', 'name code');
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    } catch (error) { next(error); }
});

router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const exam = await Exam.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: exam });
    } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
