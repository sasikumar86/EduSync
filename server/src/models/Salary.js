const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
    {
        staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
        month: { type: String, required: true }, // "2025-01"
        basic: { type: Number, required: true },
        allowances: {
            hra: { type: Number, default: 0 },
            da: { type: Number, default: 0 },
            ta: { type: Number, default: 0 },
            medical: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },
        deductions: {
            pf: { type: Number, default: 0 },
            tax: { type: Number, default: 0 },
            insurance: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },
        grossSalary: { type: Number },
        netSalary: { type: Number },
        status: { type: String, enum: ['pending', 'paid', 'hold'], default: 'pending' },
        paidDate: Date,
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

salarySchema.index({ schoolId: 1, staff: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
