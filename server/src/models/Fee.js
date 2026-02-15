const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // e.g. "Grade 5 Annual Fee"
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
        academicYear: { type: String, default: '2025-2026' },
        components: [
            {
                name: { type: String, required: true }, // e.g. "Tuition", "Lab", "Transport"
                amount: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        dueDate: Date,
        frequency: { type: String, enum: ['monthly', 'quarterly', 'halfyearly', 'annually', 'onetime'], default: 'annually' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const feePaymentSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
        amount: { type: Number, required: true },
        method: { type: String, enum: ['cash', 'cheque', 'online', 'bank_transfer', 'upi'], default: 'cash' },
        transactionId: String,
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'paid' },
        remarks: String,
        receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

feePaymentSchema.index({ schoolId: 1, student: 1 });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

module.exports = { FeeStructure, FeePayment };
