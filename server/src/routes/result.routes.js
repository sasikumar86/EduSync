const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { getGrade, calculateGPA, calculatePercentage } = require('../utils/calculations');
const { protect, authorize } = require('../middleware/auth');

// GET /api/results
router.get('/', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.exam) filter.exam = req.query.exam;
        if (req.query.student) filter.student = req.query.student;
        const results = await Result.find(filter)
            .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
            .populate('exam', 'name type')
            .populate('marks.subject', 'name code creditHours')
            .sort('-createdAt');
        res.json({ success: true, count: results.length, data: results });
    } catch (error) { next(error); }
});

// POST /api/results — Add result with auto GPA calculation
router.post('/', protect, authorize('superadmin', 'schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const { student, exam, marks } = req.body;

        // Calculate grades for each subject
        const processedMarks = marks.map((m) => {
            const pct = (m.marksObtained / m.maxMarks) * 100;
            const { grade, gradePoint } = getGrade(pct);
            return { ...m, grade, gradePoint };
        });

        const totalMarks = processedMarks.reduce((s, m) => s + m.marksObtained, 0);
        const totalMaxMarks = processedMarks.reduce((s, m) => s + m.maxMarks, 0);
        const percentage = calculatePercentage(totalMarks, totalMaxMarks);
        const gpa = calculateGPA(processedMarks);
        const { grade: overallGrade } = getGrade(percentage);

        const result = await Result.create({
            student, exam, marks: processedMarks,
            totalMarks, totalMaxMarks, percentage, gpa, overallGrade,
            schoolId: req.schoolId,
        });
        res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
});

// GET /api/results/gpa/:studentId
router.get('/gpa/:studentId', protect, async (req, res, next) => {
    try {
        const results = await Result.find({ student: req.params.studentId, schoolId: req.schoolId })
            .populate('exam', 'name type');
        const gpas = results.map((r) => ({ exam: r.exam?.name, gpa: r.gpa, percentage: r.percentage, grade: r.overallGrade }));
        const cumulativeGPA = results.length > 0
            ? Math.round((results.reduce((s, r) => s + r.gpa, 0) / results.length) * 100) / 100
            : 0;
        res.json({ success: true, data: { cumulativeGPA, results: gpas } });
    } catch (error) { next(error); }
});

// PUT /api/results/:id
router.put('/:id', protect, authorize('superadmin', 'schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Result.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
