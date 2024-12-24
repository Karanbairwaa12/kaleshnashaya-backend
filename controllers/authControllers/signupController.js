const Users = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const emailValidator = require("deep-email-validator");
// async function isEmailValid(email) {
//   return emailValidator.validate(email);
// }

const verifyEmail = async (email) => {
	try {
	  const response = await fetch(
		`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
	  );
	  const data = await response.json();
	  
	  // Check if email is deliverable and has valid mailbox
	  return {
		isValid: data.deliverability === "DELIVERABLE" && 
				 data.is_valid_format.value && 
				 !data.is_disposable_email.value,
		reason: data.deliverability !== "DELIVERABLE" ? "Email address doesn't exist" :
				!data.is_valid_format.value ? "Invalid email format" :
				data.is_disposable_email.value ? "Disposable emails not allowed" : null
	  };
	} catch (error) {
	  console.error('Email verification error:', error);
	  throw new Error('Email verification failed');
	}
  };

const userRegistration = async (req, res) => {
	try {
		const existingUser = await Users.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).send({
				result: "Failed",
				message: "Email already exists. Please use a different email.",
				data: {},
			});
		}

		 // Verify email existence
		 const { isValid, reason } = await verifyEmail(req.body.email);
		 if (!isValid) {
		   return res.status(400).send({
			 result: "Failed",
			 message: reason || "Invalid email address",
			 data: {}
		   });
		 }

		let password = req.body.password;
		password = await bcrypt.hash(password, 10);
		let user = new Users({ ...req.body, password });

		try {
			user = await user.save();
		} catch (saveError) {
			return res.status(500).send({
				result: "Failed",
				message: "Error saving user",
				specificError: saveError.message,
				data: {},
			});
		}

		user = user.toObject();
		delete user.password;
		const accessToken = jwt.sign(
			{
				id: user._id,
			},
			process.env.JWT_KEY,
			{ expiresIn: "1h" }
		);

		res.status(201).send({
			result: "Success",
			message: "User has successfully registered.",
			data: { ...user, accessToken },
		});
	} catch (error) {
		res.status(500).send({
			result: "Failed",
			message: "Internal Server Error",
			specificError: error.message,
			data: {},
		});
	}
};

module.exports = { userRegistration };
