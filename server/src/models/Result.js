const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
        marks: [
            {
                subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
                marksObtained: { type: Number, required: true },
                maxMarks: { type: Number, default: 100 },
                grade: String,
                gradePoint: Number,
            },
        ],
        totalMarks: { type: Number },
        totalMaxMarks: { type: Number },
        percentage: { type: Number },
        gpa: { type: Number },
        overallGrade: { type: String },
        rank: { type: Number },
        remarks: String,
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

resultSchema.index({ schoolId: 1, exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
