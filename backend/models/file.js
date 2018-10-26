const mongoose = require('mongoose');

const FileSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);