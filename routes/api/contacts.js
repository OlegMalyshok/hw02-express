const express = require("express");
const ContactController = require("../../models/contacts");

const router = express.Router();
const jsonParser = express.json();

router.get("/", ContactController.listContacts);

router.get("/:contactId", ContactController.getContactById);

router.post("/", jsonParser, ContactController.addContact);

router.delete("/:contactId", ContactController.removeContact);

router.put("/:contactId", jsonParser, ContactController.updateContact);

router.patch(
  "/:contactId/favorite",
  jsonParser,
  ContactController.updateStatusContact
);

module.exports = router;
