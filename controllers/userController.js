const User = require("../models/userModel");
const Template = require("../models/templateModel");
const sendFailureNotification = require("../utils/mailer");
const emailValidator = require("deep-email-validator");
const { verifyEmail } = require("../utils/common");

async function isEmailValid(email) {
	return emailValidator.validate(email);
}
const getUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findOne({ _id: userId });

		if (!user) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}
		const userData = user.toObject();
		delete userData.password;
		delete userData.email_two_step_password;
		res.send({
			result: "Success",
			message: "User retrieved successfully",
			data: userData,
		});
	} catch (err) {
		res.status(500).send({
			result: "Failed",
			message: "Internal Server Error",
			specificError: err.message,
			data: {},
		});
	}
};

const getUserByToken = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({
				result: "Failed",
				message: "User not authenticated",
				data: {},
			});
		}
		const user = await User.findOne({ _id: req.user.id });
		const userData = user.toObject();
		delete userData.password;
		delete userData.email_two_step_password;

		console.log(userData);
		res.status(200).send({
			result: "Success",
			message: "User details fetched successfully.",
			data: userData,
		});
	} catch (err) {
		res.status(500).send({
			result: "Failed",
			message: "Internal Server Error",
			specificError: err.message,
			data: {},
		});
	}
};

const updateUser = async (req, res) => {
	try {
		let userData = req.body;
		let file = req.file;

		// if (req.body.email) {
		// 	const { valid } = await isEmailValid(req.body.email);
		// 	if (!valid) {
		// 		return res.status(400).send({
		// 			result: "Failed",
		// 			message: "Email does not exist",
		// 			data: {},
		// 		});
		// 	}
		// }

		// Check if the PDF file was uploaded
		if (file) {
			userData = {
				...req.body,
				pdf: {
					name: file.originalname,
					data: file.buffer, // Store the PDF file as binary (Buffer)
					contentType: file.mimetype, // MIME type of the PDF
				},
			};
		}

		const userId = req.params.id;
		// Update the user with the provided data
		const user = await User.findOneAndUpdate(
			{ _id: userId },
			{ $set: userData },
			{ new: true }
		);

		if (!user) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		const getUser = await User.findOne(
			{ _id: userId },
			"-password -email_two_step_password"
		);

		// Clean up the returned user data (e.g., remove password and other sensitive data)

		delete getUser.password;
		delete getUser.email_two_step_password;

		res.status(200).send({
			result: "Success",
			message: "User updated successfully",
			data: getUser,
		});
	} catch (err) {
		res.status(500).send({
			result: "Failed",
			message: "Internal Server Error",
			specificError: err.message,
			data: {},
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findOne({ _id: userId });
		const userData = user.toObject();
		delete userData.password;
		delete userData.email_two_step_password;

		if (!user) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		await User.deleteOne({ _id: user._id });

		res.status(200).send({
			result: "Success",
			message: "User deleted successfully",
			data: userData,
		});
	} catch (err) {
		res.status(500).send({
			result: "Failed",
			message: "Internal Server Error",
			specificError: err.message,
			data: {},
		});
	}
};

const getAllUser = async (req, res) => {
	try {
		let limit = req.query.limit ? parseInt(req.query.limit) : 10;

		let page = req.query.page ? parseInt(req.query.page) : 1;
		if (isNaN(page) || page < 1) {
			page = 1;
		}
		if (isNaN(limit) || limit < 1) {
			limit = 10;
		}
		const totalUser = await User.countDocuments({
			user_role: { $ne: "admin" },
		});
		const totalPage = Math.ceil(totalUser / limit);

		if (totalPage === 0) {
			return res.send({
				result: "Success",
				data: [],
				message: "No users found",
			});
		}

		if (page > totalPage) {
			page = totalPage;
		}

		const skip = (page - 1) * limit;

		if (skip < 0) {
			return res
				.status(400)
				.send({ result: "Failed", message: "Invalid page number" });
		}

		let populatedUser = await User.find(
			{},
			"-password -email_two_step_password"
		)
			.sort({ createdAt: 1 })
			.skip(skip)
			.limit(limit)
			.lean();

		if (!populatedUser) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		res.status(201).send({
			result: "Success",
			message: "User course created successfully",
			data: populatedUser,
			pagination: {
				currentPage: page,
				totalPages: totalPage,
			},
		});
	} catch (err) {
		res.status(500).send({
			result: "Failed",
			message: "Internal Server Error",
			specificError: err.message,
			data: {},
		});
	}
};

const sendMail = async (req, res) => {
	try {
		const userId = req.params.id;
		const { mail_id, isresume } = req.body;

		// Verify email existence
		const { isValid, reason } = await verifyEmail(mail_id);
		if (!isValid) {
			return res.status(400).send({
				result: "Failed",
				message: reason || "Invalid email address",
				data: {},
			});
		}

		// Step 1: Fetch the User from the database
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		const findTemplate = await Template.findOne({
			_id: user?.current_template_id,
		});
		if (!findTemplate) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found, Please Apply your Template first",
				data: {},
			});
		}

		const response = await sendFailureNotification(
			mail_id,
			user,
			findTemplate,
			isresume
		);
		if (!response.success) {
			return res.status(500).json({
				result: "Failed",
				message: response.error,
				error: response.error,
			});
		}

		// Respond with success
		return res.status(200).json({
			result: "Success",
			message: response.message,
		});
	} catch (error) {
		return res.status(500).json({
			result: "Failed",
			message: "Internal server error.",
			error: error.message,
		});
	}
};

module.exports = {
	getUser,
	updateUser,
	deleteUser,
	getAllUser,
	getUserByToken,
	sendMail,
};
