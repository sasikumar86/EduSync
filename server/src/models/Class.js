const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // e.g. "Grade 1", "Grade 10"
        section: { type: String, default: 'A' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
        capacity: { type: Number, default: 40 },
        academicYear: { type: String, default: '2025-2026' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

classSchema.index({ schoolId: 1, name: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
