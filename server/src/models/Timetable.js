const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
    period: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    type: { type: String, enum: ['class', 'break', 'lunch', 'assembly'], default: 'class' },
});

const timetableSchema = new mongoose.Schema(
    {
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
        periods: [periodSchema],
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        academicYear: { type: String, default: '2025-2026' },
    },
    { timestamps: true }
);

timetableSchema.index({ schoolId: 1, class: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
