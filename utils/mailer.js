const nodemailer = require("nodemailer");
const Pdf = require("../models/pdfModel");
const User = require("../models/userModel");
const { mailUI } = require("./common");
const sendmail = require("sendmail")();

// const sendFailureNotification = async (email) => {
// 	const transporter = nodemailer.createTransport({
// 		service: "gmail",
// 		auth: {
// 			user: process.env.EMAIL_USER,
// 			pass: process.env.EMAIL_PASS,
// 		},
// 	});

// 	const mailOptions = {
// 		from: process.env.EMAIL_USER,
// 		to: email,
// 		subject: "Paper Failure Notification",
// 		html: mailUI,
// 	};

// 	try {
// 		await transporter.sendMail(mailOptions);
// 		console.log("Failure notification sent successfully.");
// 	} catch (error) {
// 		console.error("Error sending failure notification:", error);
// 	}
// };

// const sendFailureNotification = async (email, user, findTemplate, sendResume, res) => {
// 	try {
// 		// Step 2: Check if user has a PDF and if we need to send it
// 		let attachments = [];
// 		if (sendResume && user.pdf) {
// 			// Attach PDF if the user has selected to send their resume
// 			attachments = [
// 				{
// 					filename: user.pdf.name || "document.pdf", // File name from DB
// 					content: user.pdf.data, // File content (Buffer from DB)
// 					contentType: user.pdf.contentType || "application/pdf", // MIME type
// 				},
// 			];
// 		}

// 		// Step 3: Create a mail transporter
// 		const transporter = nodemailer.createTransport({
// 			service: "gmail",
// 			auth: {
// 				user: user.email,
// 				pass: user.email_two_step_password,
// 			},
// 		});

// 		// Step 4: Configure the email options
// 		const mailOptions = {
// 			from: user.email,
// 			to: email,
// 			subject: findTemplate?.subject,
// 			html: findTemplate?.mail,
// 			attachments, // Attach PDF only if the user wants to send their resume
// 		};

// 		// Step 5: Send the email
// 		await transporter.sendMail(mailOptions, (error, info) => {
// 			if (error) {
// 				console.error("Error sending email:", error);
// 				return res.status(500).json({ error: error.message });
// 			}
// 			console.log("Email sent successfully:", info);
// 		});

// 		console.log("Email sent successfully with PDF attachment (if requested).");
// 	} catch (error) {
// 		console.error("Error sending email with attachment:", error);
// 		res.status(500).json({ error: error.message });
// 	}
// };

const sendFailureNotification = async (email, user, findTemplate, sendResume) => {
	try {
		// Step 1: Prepare attachments if needed
		let attachments = [];
		if (sendResume && user?.pdf) {
			if( Object.keys(user?.pdf).length < 2 || !user?.pdf?.data){
				return {
					success: false,
					message: "Please Update your pdf First!",
					error: "Please Update your pdf"
				}
			}
			attachments = [
				{
					filename: user.pdf.name || "document.pdf",
					content: user.pdf.data,
					contentType: user.pdf.contentType || "application/pdf",
				},
			];
		}

		// Step 2: Create a mail transporter
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: user.email,
				pass: user.email_two_step_password,
			},
		});

		// Step 3: Configure mail options
		const mailOptions = {
			from: user.email,
			to: email,
			subject: findTemplate?.subject || "Default Subject",
			html: findTemplate?.mail || "<p>No template content found.</p>",
			attachments,
		};

		// Step 4: Send the email
		await transporter.sendMail(mailOptions);

		// Return success response
		return {
			success: true,
			message: "Email sent successfully.",
		};
	} catch (error) {
		return {
			success: false,
			message: error.message,
			error: "Check your Google 2-Factor Verification Password",
		};
	}
};


module.exports = sendFailureNotification;
