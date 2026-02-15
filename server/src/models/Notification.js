const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['general', 'academic', 'fee', 'event', 'emergency', 'homework'], default: 'general' },
        priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
        recipients: {
            roles: [{ type: String, enum: ['schooladmin', 'teacher', 'student', 'parent'] }],
            classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
            users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        scheduledAt: Date,
        expiresAt: Date,
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    },
    { timestamps: true }
);

notificationSchema.index({ schoolId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
