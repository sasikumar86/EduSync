const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'School name is required'], trim: true },
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'India' },
        },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: String,
        logo: { type: String, default: '' },
        principal: { type: String },
        establishedYear: Number,
        board: { type: String, enum: ['CBSE', 'ICSE', 'State', 'IB', 'IGCSE', 'Other'], default: 'CBSE' },
        subscription: {
            plan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
            startDate: Date,
            endDate: Date,
            isActive: { type: Boolean, default: true },
        },
        settings: {
            academicYear: { type: String, default: '2025-2026' },
            gradeSystem: { type: String, enum: ['gpa', 'percentage', 'grade'], default: 'gpa' },
            currency: { type: String, default: 'INR' },
            timezone: { type: String, default: 'Asia/Kolkata' },
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);
