const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/students — List students (tenant scoped)
router.get('/', protect, authorize('superadmin', 'schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.class) filter.class = req.query.class;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [{ admissionNo: searchRegex }];
        }
        const students = await Student.find(filter)
            .populate('user', 'name email phone avatar')
            .populate('class', 'name section')
            .sort('-createdAt');
        res.json({ success: true, count: students.length, data: students });
    } catch (error) { next(error); }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('user', 'name email phone avatar')
            .populate('class', 'name section')
            .populate('parentUser', 'name email phone');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (error) { next(error); }
});

// POST /api/students — Admit new student
router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const { name, email, password, phone, ...studentData } = req.body;
        // Create user account for student
        const user = await User.create({ name, email, password: password || 'Student@123', role: 'student', schoolId: req.schoolId, phone });
        // Create student profile
        const student = await Student.create({ ...studentData, user: user._id, schoolId: req.schoolId });

        // Create parent user if guardian email provided
        if (studentData.guardian && studentData.guardian.guardianEmail) {
            const parentUser = await User.create({
                name: studentData.guardian.guardianName || studentData.guardian.fatherName || 'Parent',
                email: studentData.guardian.guardianEmail,
                password: 'Parent@123',
                role: 'parent',
                schoolId: req.schoolId,
                phone: studentData.guardian.guardianPhone,
            });
            student.parentUser = parentUser._id;
            await student.save();
        }

        res.status(201).json({ success: true, data: student });
    } catch (error) { next(error); }
});

// PUT /api/students/:id
router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (error) { next(error); }
});

// POST /api/students/promote — Bulk promote students to next class
router.post('/promote', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const { studentIds, toClass } = req.body;
        const result = await Student.updateMany(
            { _id: { $in: studentIds }, schoolId: req.schoolId },
            { class: toClass }
        );
        res.json({ success: true, message: `${result.modifiedCount} students promoted` });
    } catch (error) { next(error); }
});

// DELETE /api/students/:id
router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
