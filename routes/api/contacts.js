const express = require("express");
const ContactController = require("../../controllers/contact");

const router = express.Router();
const jsonParser = express.json();

router.get("/", ContactController.getContacts);

router.get("/:contactId", ContactController.getContact);

router.post("/", jsonParser, ContactController.createContact);

router.delete("/:contactId", ContactController.deleteContact);

router.put("/:contactId", jsonParser, ContactController.updateContact);

module.exports = router;
