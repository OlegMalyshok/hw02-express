const express = require("express");
const ContactController = require("../../controllers/contactsControllers");

const router = express.Router();
const jsonParser = express.json();

const authenticate = require("../../middleware/auth");
const isValidId = require("../../middleware/isValidId");

router.get("/", authenticate, ContactController.listContacts);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  ContactController.getContactById
);

router.post("/", jsonParser, authenticate, ContactController.addContact);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  ContactController.removeContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  jsonParser,
  ContactController.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  jsonParser,
  ContactController.updateStatusContact
);

module.exports = router;
