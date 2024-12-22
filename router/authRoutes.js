const express = require("express");
const {
  getUserAuthentication,
} = require("../controllers/authControllers/loginController");
const {
  userRegistration,
} = require("../controllers/authControllers/signupController");

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *      - Authentication
 *     summary: User registration
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: "string"
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 format: email
 *                 example: "string"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "string"
 *               phone_number:
 *                 type: string
 *                 description: The user's phone number
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: user not Authenticated
 *       500:
 *         description: Internal server error
 */
router.route("/signup").post(userRegistration);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *      - Authentication
 *     summary: User login
 *     description: Authenticate user credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 format: email
 *                 example: "string"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "string"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/login").post(getUserAuthentication);

module.exports = router;
