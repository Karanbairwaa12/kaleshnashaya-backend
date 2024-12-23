const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "User Name is a required field."],
			minlength: 3,
		},
		email: {
			type: String,
			required: [true, "User e-mail is a required field."],
			unique: [true, "User e-mail must be unique"],
			match: /^\S+@\S+\.\S+$/,
			minlength: 7,
			maxlength: 60,
			index: true,
		},
		password: {
			type: String,
			required: [true, "Password is a required field."],
			minlength: 6,
		},
		email_two_step_password: {
			type: String,
			required: [true, "Two-step password is a required field."],
		},
		user_role: {
			type: String,
			//   required: [true, "User Role is a required field."],
			enum: {
				values: ["user", "admin"],
				message: "User Role must be either 'user' or 'admin'.",
			},
			default: "user",
		},
		phone_number: {
			type: String,
			//   required: [true, "Phone number is a required field."],
			minlength: 10,
			maxlength: 15,
		},
		address: {
			type: String,
			maxlength: 250,
		},
		// image: {
		//   type: String,
		// },
		language: {
			type: String,
			default: "English",
		},
		pdf: {
			name: { type: String }, // PDF file name (optional for login)
			data: { type: Buffer }, // File content as binary (optional for login)
			contentType: { type: String }, // MIME type (optional for login)
			uploadedAt: { type: Date, default: Date.now }, // Upload timestamp (optional for login)
		},
    current_template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'template',  // Reference to the template model
      required: false,  // This can be optional, depending on your requirement
    },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("users", userSchema);
