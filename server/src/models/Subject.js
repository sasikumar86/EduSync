const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true },
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        type: { type: String, enum: ['core', 'elective', 'lab'], default: 'core' },
        creditHours: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

subjectSchema.index({ schoolId: 1, class: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
