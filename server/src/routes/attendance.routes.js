const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

// GET /api/attendance — query by class + date
router.get('/', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.class) filter.class = req.query.class;
        if (req.query.date) filter.date = new Date(req.query.date);
        if (req.query.student) filter.student = req.query.student;
        if (req.query.month) {
            const [year, month] = req.query.month.split('-');
            filter.date = {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            };
        }
        const records = await Attendance.find(filter)
            .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
            .populate('class', 'name section')
            .sort('-date');
        res.json({ success: true, count: records.length, data: records });
    } catch (error) { next(error); }
});

// POST /api/attendance — Mark attendance (bulk)
router.post('/', protect, authorize('schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const { records, classId, date } = req.body;
        // records = [{ student: id, status: 'present' }, ...]
        const attendanceRecords = records.map((r) => ({
            student: r.student,
            class: classId,
            date: new Date(date),
            status: r.status,
            remarks: r.remarks || '',
            markedBy: req.user._id,
            schoolId: req.schoolId,
        }));

        // Upsert — update if exists, create if not
        const operations = attendanceRecords.map((record) => ({
            updateOne: {
                filter: { student: record.student, date: record.date },
                update: { $set: record },
                upsert: true,
            },
        }));

        await Attendance.bulkWrite(operations);
        res.status(201).json({ success: true, message: `Attendance marked for ${records.length} students` });
    } catch (error) { next(error); }
});

// GET /api/attendance/summary/:studentId
router.get('/summary/:studentId', protect, async (req, res, next) => {
    try {
        const records = await Attendance.find({ student: req.params.studentId, schoolId: req.schoolId });
        const total = records.length;
        const present = records.filter((r) => r.status === 'present').length;
        const absent = records.filter((r) => r.status === 'absent').length;
        const late = records.filter((r) => r.status === 'late').length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        res.json({ success: true, data: { total, present, absent, late, percentage } });
    } catch (error) { next(error); }
});

module.exports = router;
