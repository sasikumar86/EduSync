const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        vehicleNumber: { type: String, required: true },
        type: { type: String, enum: ['bus', 'van', 'minibus'], default: 'bus' },
        capacity: { type: Number, required: true },
        driverName: { type: String, required: true },
        driverPhone: { type: String, required: true },
        driverLicense: String,
        insuranceExpiry: Date,
        fitnessExpiry: Date,
        status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

const routeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        stops: [
            {
                name: { type: String, required: true },
                time: { type: String, required: true },
                order: { type: Number, required: true },
            },
        ],
        monthlyFee: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

vehicleSchema.index({ schoolId: 1 });
routeSchema.index({ schoolId: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const Route = mongoose.model('Route', routeSchema);

module.exports = { Vehicle, Route };
