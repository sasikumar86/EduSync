const express = require('express');
const router = express.Router();
const { ChatMessage, SchoolFaq } = require('../models/Chat');
const School = require('../models/School');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res, next) => {
    try {
        const { question } = req.body;
        const schoolId = req.schoolId;
        const words = question.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
        let faq = null;
        if (words.length > 0) {
            faq = await SchoolFaq.findOne({
                schoolId, isActive: true,
                $or: [{ keywords: { $in: words } }, { question: new RegExp(words.join('|'), 'i') }],
            }).sort('-priority');
        }
        let answer;
        if (faq) {
            answer = faq.answer;
        } else {
            const school = await School.findById(schoolId);
            const q = question.toLowerCase();
            if (q.includes('timing') || q.includes('time') || q.includes('hours'))
                answer = `${school?.name || 'Our school'} operates 8:00 AM to 3:00 PM, Mon-Fri.`;
            else if (q.includes('admission'))
                answer = `Admissions open for ${school?.settings?.academicYear || '2025-2026'}. Contact ${school?.phone || 'office'}.`;
            else if (q.includes('fee'))
                answer = `Check the Fees section in your portal for detailed fee structure.`;
            else if (q.includes('transport') || q.includes('bus'))
                answer = `Check the Transport section for routes and timings.`;
            else if (q.includes('contact'))
                answer = `Reach us at ${school?.phone || ''} or ${school?.email || ''}.`;
            else
                answer = `Thank you for your question! Contact admin at ${school?.phone || 'office'} for details.`;
        }
        await ChatMessage.create({ question, answer, user: req.user._id, schoolId });
        res.json({ success: true, data: { question, answer } });
    } catch (error) { next(error); }
});

router.get('/history', protect, async (req, res, next) => {
    try {
        const msgs = await ChatMessage.find({ user: req.user._id, schoolId: req.schoolId }).sort('-createdAt').limit(50);
        res.json({ success: true, data: msgs });
    } catch (error) { next(error); }
});

router.get('/faqs', protect, async (req, res, next) => {
    try {
        const faqs = await SchoolFaq.find({ schoolId: req.schoolId }).sort('-priority');
        res.json({ success: true, data: faqs });
    } catch (error) { next(error); }
});

router.post('/faqs', protect, async (req, res, next) => {
    try {
        const faq = await SchoolFaq.create({ ...req.body, schoolId: req.schoolId });
        res.status(201).json({ success: true, data: faq });
    } catch (error) { next(error); }
});

module.exports = router;
