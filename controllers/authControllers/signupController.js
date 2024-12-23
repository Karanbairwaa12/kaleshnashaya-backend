const Users = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
  try {
    const { email, password, name, email_two_step_password } = req.body;

    const {valid} = await isEmailValid(email);
    if(!valid) {
      return res.status(400).send({
        result: "Failed",
        message: "Email does not exist",
        data: {},
      });
    }

    // Basic validation for required fields
    if (!email || !password || !name || !email_two_step_password) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields"
      });
    }

    // Check for existing user
    const existingUser = await Users.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const userData = {
      ...req.body,
      password: hashedPassword
    };

    // Create and save user
    const user = await Users.create(userData);

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.email_two_step_password;

    return res.status(201).json({
      status: "success",
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: "error",
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

module.exports = { userRegistration };