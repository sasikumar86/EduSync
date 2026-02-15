const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        isbn: { type: String },
        category: { type: String, enum: ['textbook', 'reference', 'fiction', 'non-fiction', 'magazine', 'journal', 'other'], default: 'textbook' },
        publisher: String,
        publishYear: Number,
        totalCopies: { type: Number, default: 1 },
        availableCopies: { type: Number, default: 1 },
        location: String, // shelf/rack
        coverImage: { type: String, default: '' },
        isDigital: { type: Boolean, default: false },
        digitalUrl: { type: String, default: '' }, // PDF or ePub URL
        description: String,
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const bookIssueSchema = new mongoose.Schema(
    {
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
        issueDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        returnDate: Date,
        status: { type: String, enum: ['issued', 'returned', 'overdue', 'lost'], default: 'issued' },
        fine: { type: Number, default: 0 },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

bookSchema.index({ schoolId: 1 });
bookIssueSchema.index({ schoolId: 1, student: 1 });

const Book = mongoose.model('Book', bookSchema);
const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

module.exports = { Book, BookIssue };
