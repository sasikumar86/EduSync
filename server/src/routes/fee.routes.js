const express = require('express');
const router = express.Router();
const { FeeStructure, FeePayment } = require('../models/Fee');
const { calculatePendingFee } = require('../utils/calculations');
const { protect, authorize } = require('../middleware/auth');

// GET /api/fees/structures
router.get('/structures', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.class) filter.class = req.query.class;
        const structures = await FeeStructure.find(filter).populate('class', 'name section').sort('name');
        res.json({ success: true, data: structures });
    } catch (error) { next(error); }
});

// POST /api/fees/structures
router.post('/structures', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: structure });
    } catch (error) { next(error); }
});

// PUT /api/fees/structures/:id
router.put('/structures/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
        res.json({ success: true, data: structure });
    } catch (error) { next(error); }
});

// GET /api/fees/payments
router.get('/payments', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.student) filter.student = req.query.student;
        if (req.query.status) filter.status = req.query.status;
        const payments = await FeePayment.find(filter)
            .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
            .populate('feeStructure', 'name totalAmount')
            .sort('-date');
        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) { next(error); }
});

// POST /api/fees/pay — Record a payment
router.post('/pay', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const payment = await FeePayment.create({ ...req.body, receivedBy: req.user._id, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: payment });
    } catch (error) { next(error); }
});

// GET /api/fees/pending/:studentId
router.get('/pending/:studentId', protect, async (req, res, next) => {
    try {
        const Student = require('../models/Student');
        const student = await Student.findById(req.params.studentId);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const structures = await FeeStructure.find({ class: student.class, schoolId: req.schoolId });
        const payments = await FeePayment.find({ student: req.params.studentId, schoolId: req.schoolId });

        const feeDetails = structures.map((s) => {
            const structurePayments = payments.filter((p) => p.feeStructure?.toString() === s._id.toString());
            const totalPaid = structurePayments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
            const pending = calculatePendingFee(s.totalAmount, structurePayments);
            return { structure: s, totalPaid, pending };
        });

        const totalPending = feeDetails.reduce((s, f) => s + f.pending, 0);
        res.json({ success: true, data: { feeDetails, totalPending } });
    } catch (error) { next(error); }
});

module.exports = router;
