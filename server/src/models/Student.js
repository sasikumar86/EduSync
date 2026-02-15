const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        admissionNo: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        section: { type: String, default: 'A' },
        rollNo: { type: Number },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        guardian: {
            fatherName: String,
            motherName: String,
            guardianName: String,
            guardianPhone: String,
            guardianEmail: String,
            relation: String,
        },
        parentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        admissionDate: { type: Date, default: Date.now },
        previousSchool: String,
        medicalInfo: {
            allergies: [String],
            conditions: [String],
        },
        transportRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
        status: { type: String, enum: ['active', 'graduated', 'transferred', 'dropped'], default: 'active' },
        photo: { type: String, default: '' },
    },
    { timestamps: true }
);

studentSchema.index({ schoolId: 1, admissionNo: 1 }, { unique: true });
studentSchema.index({ schoolId: 1, class: 1 });

module.exports = mongoose.model('Student', studentSchema);
