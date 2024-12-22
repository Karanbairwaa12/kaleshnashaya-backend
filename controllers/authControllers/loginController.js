const Users = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserAuthentication = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        result: "Failed",
        message: "Email and password are required.",
        data: {},
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).send({
        result: "Failed",
        message: "Invalid email or password.",
        data: {},
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({
        result: "Failed",
        message: "Invalid email or password.",
        data: {},
      });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.user_role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.courses;

    res.status(200).send({
      result: "Success",
      message: "Login successful.",
      data: {accessToken, role: userData.user_role},
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

module.exports = { getUserAuthentication };
