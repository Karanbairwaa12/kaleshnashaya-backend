const Users = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    // Check for existing user - using lean() for faster query
    const existingUser = await Users.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new Users({ ...req.body, hashedPassword });
      

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

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Return response without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(201).json({
      status: "success",
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

module.exports = { userRegistration };