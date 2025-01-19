const express = require('express');
const { getTemplate, updateTemplate, deleteTemplate, postTemplate, getAllTemplate, updateUserCurrentTemplateId } = require('../controllers/tamplateController');
const router = express.Router();

router.route("/:user_id").post(postTemplate).get(getAllTemplate)
router.route("/apply/:id").get(getTemplate).patch(updateTemplate).delete(deleteTemplate);
router.route("/apply/:user_id/:template_id").patch(updateUserCurrentTemplateId)

module.exports = router;