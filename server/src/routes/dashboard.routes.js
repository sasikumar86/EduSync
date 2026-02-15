const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const { FeePayment } = require('../models/Fee');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res, next) => {
    try {
        const schoolId = req.schoolId;
        const [students, staff, classes, recentPayments, recentNotifications] = await Promise.all([
            Student.countDocuments({ schoolId, status: 'active' }),
            Staff.countDocuments({ schoolId, status: 'active' }),
            Class.countDocuments({ schoolId, isActive: true }),
            FeePayment.find({ schoolId, status: 'paid' }).sort('-date').limit(5)
                .populate({ path: 'student', populate: { path: 'user', select: 'name' } }),
            Notification.find({ schoolId }).sort('-createdAt').limit(5),
        ]);

        // Today's attendance
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayAttendance = await Attendance.countDocuments({ schoolId, date: today, status: 'present' });
        const totalToday = await Attendance.countDocuments({ schoolId, date: today });
        const attendanceRate = totalToday > 0 ? Math.round((todayAttendance / totalToday) * 100) : 0;

        // Monthly revenue
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyRevenue = await FeePayment.aggregate([
            { $match: { schoolId: require('mongoose').Types.ObjectId.createFromHexString(schoolId.toString()), status: 'paid', date: { $gte: monthStart } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        res.json({
            success: true,
            data: {
                totalStudents: students,
                totalStaff: staff,
                totalClasses: classes,
                attendanceRate,
                monthlyRevenue: monthlyRevenue[0]?.total || 0,
                recentPayments,
                recentNotifications,
            },
        });
    } catch (error) { next(error); }
});

module.exports = router;
