const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const { calculateNetSalary } = require('../utils/calculations');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.month) filter.month = req.query.month;
        if (req.query.status) filter.status = req.query.status;
        const salaries = await Salary.find(filter)
            .populate({ path: 'staff', populate: { path: 'user', select: 'name email' } })
            .sort('-month');
        res.json({ success: true, count: salaries.length, data: salaries });
    } catch (error) { next(error); }
});

router.post('/', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const { grossSalary, netSalary } = calculateNetSalary(req.body);
        const salary = await Salary.create({ ...req.body, grossSalary, netSalary, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: salary });
    } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        if (req.body.basic || req.body.allowances || req.body.deductions) {
            const existing = await Salary.findById(req.params.id);
            const mergedData = { ...existing.toObject(), ...req.body };
            const { grossSalary, netSalary } = calculateNetSalary(mergedData);
            req.body.grossSalary = grossSalary;
            req.body.netSalary = netSalary;
        }
        const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!salary) return res.status(404).json({ success: false, message: 'Salary record not found' });
        res.json({ success: true, data: salary });
    } catch (error) { next(error); }
});

router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Salary.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
