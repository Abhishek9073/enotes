const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});


const File = mongoose.model('File', fileSchema);

module.exports = File;