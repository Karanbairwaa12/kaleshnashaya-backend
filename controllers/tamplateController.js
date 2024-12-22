const Template = require("../models/templateModel");
const User = require("../models/userModel");

const getAllTemplate = async (req, res) => {
	try {
		const { user_id } = req.params; // Extract user_id from the URL parameters

		// Fetch templates associated with the user_id
		const templates = await Template.find({ user_id: user_id }); // Query templates by user_id

		// If no templates are found, send a message indicating so
		if (!templates.length) {
			return res.status(404).send({
				result: "Failed",
				message: "No templates found for this user",
				data: {},
			});
		}

		// Send response with the list of templates
		res.status(200).send({
			result: "Success",
			message: "Templates fetched successfully",
			data: templates,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			result: "Failed",
			message: "Server error",
			data: error,
		});
	}
};

const getTemplate = async (req, res) => {
	try {
		const templateId = req.params.id; // Get template ID from URL parameter

		// Find the template by ID
		const template = await Template.findById(templateId);

		if (!template) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found",
				data: {},
			});
		}

		// Return the found template
		res.status(200).send({
			result: "Success",
			message: "Template fetched successfully",
			data: template,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			result: "Failed",
			message: "Server error",
			data: error,
		});
	}
};

const postTemplate = async (req, res) => {
	try {
		const { template_name, subject, mail } = req.body;
		const { user_id } = req.params; // Extract user_id from the URL parameters

		// Validate the request body
		if (!template_name || !subject || !mail) {
			return res.status(400).send({
				result: "Failed",
				message: "Missing required fields",
				data: {},
			});
		}

		// Check if the user exists
		const user = await User.findById(user_id);
		if (!user) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		// Check if the template name already exists for the current user
		const isTemplateNameSame = await Template.findOne({
			template_name,
			user_id: user_id, // Check specifically for this user
		});

		if (isTemplateNameSame) {
			return res.status(400).send({
				result: "Failed",
				message: "Template name already exists for this user",
				data: {},
			});
		}

		// Create a new template and associate it with the user
		const newTemplate = new Template({
			template_name,
			subject,
			mail,
			user_id: user._id, // Set the user_id for the template
		});
		await newTemplate.save();

		// Return the newly created template
		return res.status(201).send({
			result: "Success",
			message: "Template created successfully",
			data: newTemplate,
		});
	} catch (error) {
		console.error("Error in postTemplate:", error);
		return res.status(500).send({
			result: "Failed",
			message: "Server error",
			data: error,
		});
	}
};


const updateTemplate = async (req, res) => {
	try {
		const templateId = req.params.id; // Get template ID from URL parameter
		const templateData = req.body; // Get the fields to update from the request body

		// Use findOneAndUpdate to update only the fields that are passed in the body
		const updatedTemplate = await Template.findOneAndUpdate(
			{ _id: templateId }, // Match the template by ID
			{ $set: templateData }, // Set only the fields that are provided in req.body
			{ new: true } // Return the updated document after the update
		);

		if (!updatedTemplate) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found",
				data: {},
			});
		}

		// Return the updated template
		res.status(200).send({
			result: "Success",
			message: "Template updated successfully",
			data: updatedTemplate,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			result: "Failed",
			message: "Server error",
			data: error,
		});
	}
};

const deleteTemplate = async (req, res) => {
	try {
		const templateId = req.params.id;
        console.log(templateId, "Template deleted")
		// Find the template by ID and delete it
		const findTemplate = await Template.findById(templateId);
		if (!findTemplate) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found",
				data: [],
			});
		}
        console.log("working")
		const template = await Template.deleteOne({ _id: templateId });

		if (!template) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found",
				data: [],
			});
		}

        const templateData = await Template.find({user_id: findTemplate?.user_id})
        if(!templateData) {
            return res.status(404).send({
                result: "Failed",
                message: "No templates found for this user",
                data: [],
            });
        }

        console.log(templateData);

		if (!template) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found",
				data: [],
			});
		}

		// Return success message
		res.status(200).send({
			result: "Success",
			message: "Template deleted successfully",
			data: templateData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			result: "Failed",
			message: "Server error",
			data: error,
		});
	}
};

const updateUserCurrentTemplateId = async (req, res) => {
	try {
		const { user_id, template_id } = req.params;

		// Check if the template exists
		const template = await Template.findById(template_id);
		if (!template) {
			return res.status(404).send({
				result: "Failed",
				message: "Template not found",
				data: {},
			});
		}
		// Find the user by their user_id
		const user = await User.findById(user_id);
		if (!user) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		// Update the user's current_template_id
		user.current_template_id = template_id;
		await user.save();

		const userData = await User.findById(user_id);
		if (!userData) {
			return res.status(404).send({
				result: "Failed",
				message: "User not found",
				data: {},
			});
		}

		// Return the updated user details
		res.status(200).send({
			result: "Success",
			message: "User's template updated successfully",
			data: userData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			result: "Failed",
			message: "Server error",
			data: error,
		});
	}
};

module.exports = {
	getTemplate,
	postTemplate,
	deleteTemplate,
	updateTemplate,
	getAllTemplate,
	updateUserCurrentTemplateId,
};
