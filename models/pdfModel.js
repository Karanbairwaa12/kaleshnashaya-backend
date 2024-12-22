const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    name: { type: String, required: true }, // PDF file name
    data: { type: Buffer, required: true }, // File content as binary
    contentType: { type: String, required: true }, // MIME type (e.g., "application/pdf")
    uploadedAt: { type: Date, default: Date.now }, // Upload timestamp
});

module.exports = mongoose.model("Pdf", pdfSchema);
