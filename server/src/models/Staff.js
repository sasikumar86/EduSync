const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
    {
        employeeId: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        department: { type: String, required: true },
        designation: { type: String, required: true },
        qualification: String,
        specialization: String,
        experience: { type: Number, default: 0 },
        dateOfJoining: { type: Date, default: Date.now },
        dateOfBirth: Date,
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        salary: {
            basic: { type: Number, default: 0 },
            allowances: { type: Number, default: 0 },
            deductions: { type: Number, default: 0 },
        },
        bankDetails: {
            bankName: String,
            accountNo: String,
            ifscCode: String,
        },
        classesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
        subjectsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
        status: { type: String, enum: ['active', 'resigned', 'terminated', 'retired'], default: 'active' },
        photo: { type: String, default: '' },
    },
    { timestamps: true }
);

staffSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model('Staff', staffSchema);
