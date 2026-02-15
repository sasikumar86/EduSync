const express = require('express');
const router = express.Router();
const { Vehicle, Route } = require('../models/Transport');
const { protect, authorize } = require('../middleware/auth');

// Vehicles
router.get('/vehicles', protect, async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({ schoolId: req.schoolId }).sort('vehicleNumber');
        res.json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) { next(error); }
});

router.post('/vehicles', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) { next(error); }
});

router.put('/vehicles/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, data: vehicle });
    } catch (error) { next(error); }
});

router.delete('/vehicles/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

// Routes
router.get('/routes', protect, async (req, res, next) => {
    try {
        const routes = await Route.find({ schoolId: req.schoolId })
            .populate('vehicle', 'vehicleNumber type driverName driverPhone capacity')
            .sort('name');
        res.json({ success: true, count: routes.length, data: routes });
    } catch (error) { next(error); }
});

router.post('/routes', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const route = await Route.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: route });
    } catch (error) { next(error); }
});

router.put('/routes/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, data: route });
    } catch (error) { next(error); }
});

router.delete('/routes/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Route.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

module.exports = router;
