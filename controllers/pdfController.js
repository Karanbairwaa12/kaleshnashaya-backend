const Pdf = require("../models/pdfModel.js");
const sendFailureNotification = require("../utils/mailer.js");
const postPdf = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No PDF file uploaded" });
		}

		// Create a new document in the database
		const pdf = new Pdf({
			name: req.file.originalname,
			data: req.file.buffer,
			contentType: req.file.mimetype,
		});

		// Save the PDF document
		const savedPdf = await pdf.save();

		return res.status(201).json({
			message: "PDF uploaded successfully",
			pdfId: savedPdf._id,
		});
	} catch (error) {
		console.error("Error uploading PDF:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const sendMail = async(req, res) => {
    try {
        await sendFailureNotification("meanimehu@gmail.com", "6762fdb48c17a48b288c7ca5");
        return res.status(200).json({ message: "Email sent successfully" });
    }catch(error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
	postPdf,
    sendMail
};
