const express = require("express");
const multer = require("multer")
const {
	getUser,
	updateUser,
	deleteUser,
	getAllUser,
	getUserByToken,
	sendMail,
	
} = require("../controllers/userController");
const { verifyAuth } = require("../middlewares/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

/**
 * @swagger
 * /user/all:
 *   get:
 *     tags:
 *       - User Crud
 *     summary: Get all users
 *     description: Get a list of all users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to return
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/all").get(getAllUser);

/**
 * @swagger
 * /user/loggedUser:
 *   get:
 *     tags:
 *       - User Crud
 *     summary: Get logged-in user
 *     description: Retrieve the details of the logged-in user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved logged-in user
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
router.route("/loggedUser").get(verifyAuth, getUserByToken);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User Crud
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *   patch:
 *     tags:
 *       - User Crud
 *     summary: Update user by ID
 *     description: Update a user's details by their ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - User Crud
 *     summary: Delete user by ID
 *     description: Delete a user by their ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/:id").get(getUser).patch(upload.single("pdf"),updateUser).post(sendMail).delete(deleteUser);
// router.route("/upload/:id").patch(upload.single("image"), updateUserData);

module.exports = router;
