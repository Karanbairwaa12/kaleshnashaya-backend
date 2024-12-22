const multer = require("multer");
const express = require("express");
const { postPdf, sendMail } = require("../controllers/pdfController");
const router = express.Router();

// Set up Multer storage (store file in memory as a Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/upload").post(upload.single("pdf"),postPdf)


// router.route("/upload/:id").patch(upload.single("image"), updateUserData);

module.exports = router;