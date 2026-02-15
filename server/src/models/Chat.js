const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sessionId: String,
        category: { type: String, enum: ['general', 'admission', 'fee', 'academic', 'transport', 'other'], default: 'general' },
        helpful: { type: Boolean },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

const schoolFaqSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        keywords: [String],
        category: { type: String, enum: ['general', 'admission', 'fee', 'academic', 'transport', 'other'], default: 'general' },
        priority: { type: Number, default: 0 },
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

schoolFaqSchema.index({ schoolId: 1, keywords: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const SchoolFaq = mongoose.model('SchoolFaq', schoolFaqSchema);

module.exports = { ChatMessage, SchoolFaq };
