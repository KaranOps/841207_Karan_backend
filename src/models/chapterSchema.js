const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    chapter: { type: String, required: true },
    class: { type: String, required: true },
    unit: { type: String, required: true },
    yearWiseQuestionCoun: {
        type: Map,
        of: Number,
        default: {}
    },
    questionSolved: { type: Number, default: 0 },
    status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  isWeakChapter: { type: Boolean, default: false },
//   Adds timestamps for createdAt and updatedAt.
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('chapterSchema', chapterSchema);