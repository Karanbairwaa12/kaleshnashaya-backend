const Users = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require('deep-email-validator');

async function isEmailValid(email) {
  return emailValidator.validate(email)
  }
const userRegistration = async (req, res) => {
  try {
    const {valid} = await isEmailValid(req.body.email);
    if(!valid) {
      return res.status(400).send({
        result: "Failed",
        message: "Email does not exist",
        data: {},
      });
    }
    const bodyLength = Object.keys(req.body)?.length;
    if (req.body && bodyLength > 0) {
      const existingUser = await Users.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).send({
          result: "Failed",
          message: "Email already exists. Please use a different email.",
          data: {},
        });
      }

      const highestUserId = await Users.findOne({}, "id").sort("-id");
     
      const nextUserId = highestUserId ? highestUserId.id + 1 : 1;
     

      let password = req.body.password;
      password = await bcrypt.hash(password, 10);
      let user = new Users({ ...req.body, id: nextUserId, password });
      

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
        data: {...user, accessToken},
      });
    } else {
      res.status(400).send({
        result: "Failed",
        message: "User registration validation Failed.",
        data: {},
      });
    }
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
