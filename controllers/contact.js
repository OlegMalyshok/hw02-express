function getContacts(req, res, next) {
  res.send("Get book");
}

function getContact(req, res, next) {
  const { contactId } = req.params;
  res.send(`Get contact ${contactId}`);
}

function createContact(req, res, next) {
  res.send("Create contact");
}

function updateContact(req, res, next) {
  const { contactId } = req.params;

  res.send(`Update contact" ${contactId}`);
}

function deleteContact(req, res, next) {
  const { contactId } = req.params;

  res.send(`Delete contact" ${contactId}`);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
