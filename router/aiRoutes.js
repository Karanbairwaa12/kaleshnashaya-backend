const express = require('express');
const { chatWithAI } = require('../controllers/authControllers/aiController');
const router = express.Router();


router.route("/").post(chatWithAI)

module.exports = router;