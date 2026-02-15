const express = require('express');
const router = express.Router();
const { Book, BookIssue } = require('../models/Library');
const { protect, authorize } = require('../middleware/auth');

// Books
router.get('/books', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.category) filter.category = req.query.category;
        if (req.query.search) filter.title = new RegExp(req.query.search, 'i');
        if (req.query.digital === 'true') filter.isDigital = true;
        const books = await Book.find(filter).sort('title');
        res.json({ success: true, count: books.length, data: books });
    } catch (error) { next(error); }
});

router.get('/books/:id', protect, async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
        res.json({ success: true, data: book });
    } catch (error) { next(error); }
});

router.post('/books', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const book = await Book.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: book });
    } catch (error) { next(error); }
});

router.put('/books/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
        res.json({ success: true, data: book });
    } catch (error) { next(error); }
});

router.delete('/books/:id', protect, authorize('superadmin', 'schooladmin'), async (req, res, next) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) { next(error); }
});

// Book Issues
router.get('/issues', protect, async (req, res, next) => {
    try {
        const filter = { schoolId: req.schoolId };
        if (req.query.status) filter.status = req.query.status;
        if (req.query.student) filter.student = req.query.student;
        const issues = await BookIssue.find(filter)
            .populate('book', 'title author isbn')
            .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
            .sort('-issueDate');
        res.json({ success: true, count: issues.length, data: issues });
    } catch (error) { next(error); }
});

router.post('/issue', protect, authorize('superadmin', 'schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const book = await Book.findById(req.body.book);
        if (!book || book.availableCopies <= 0) {
            return res.status(400).json({ success: false, message: 'Book not available' });
        }
        const issue = await BookIssue.create({ ...req.body, issuedBy: req.user._id, schoolId: req.schoolId });
        book.availableCopies -= 1;
        await book.save();
        res.status(201).json({ success: true, data: issue });
    } catch (error) { next(error); }
});

router.post('/return/:issueId', protect, authorize('superadmin', 'schooladmin', 'teacher'), async (req, res, next) => {
    try {
        const issue = await BookIssue.findById(req.params.issueId);
        if (!issue) return res.status(404).json({ success: false, message: 'Issue record not found' });
        issue.returnDate = new Date();
        issue.status = 'returned';
        issue.fine = req.body.fine || 0;
        await issue.save();
        const book = await Book.findById(issue.book);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }
        res.json({ success: true, data: issue });
    } catch (error) { next(error); }
});

module.exports = router;
