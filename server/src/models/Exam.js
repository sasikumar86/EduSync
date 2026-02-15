const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // e.g. "Mid-Term Exam", "Final Exam"
        type: { type: String, enum: ['unit', 'midterm', 'final', 'quarterly', 'halfyearly', 'annual'], default: 'midterm' },
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
        subjects: [
            {
                subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
                maxMarks: { type: Number, default: 100 },
                passingMarks: { type: Number, default: 35 },
                date: Date,
            },
        ],
        startDate: Date,
        endDate: Date,
        academicYear: { type: String, default: '2025-2026' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

examSchema.index({ schoolId: 1, class: 1 });

module.exports = mongoose.model('Exam', examSchema);
