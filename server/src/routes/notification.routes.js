const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        // For non-admin, filter by role in recipients
        if (!['superadmin', 'schooladmin'].includes(req.user.role)) {
            filter.$or = [
                { 'recipients.roles': req.user.role },
                { 'recipients.users': req.user._id },
            ];
        }
        if (req.query.type) filter.type = req.query.type;
        const notifications = await Notification.find(filter)
            .populate('sender', 'name role')
            .sort('-createdAt')
            .limit(50);
        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (error) { next(error); }
});

router.post('/', protect, authorize('superadmin', 'schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const notification = await Notification.create({ ...req.body, sender: req.user._id, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: notification });
    } catch (error) { next(error); }
});

// Mark as read
router.put('/:id/read', protect, async (req, res, next) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user._id } });
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
