const Contact = require("../models/contact");
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}/)
    .required(),
});

const addSchemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id }).exec();

    console.log(contacts);

    res.send(contacts);
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId).exec();

    if (contact === null) {
      return res.status(404).send("Contact not found");
    }

    res.send(contact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findByIdAndDelete(contactId);

    if (contact === null) {
      return res.status(404).send("Contact not found");
    }

    res.send({ contactId });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const { error } = addSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
    userId: req.user.id,
  };

  try {
    const result = await Contact.create(contact);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = addSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const result = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });

    if (result === null) {
      return res.status(404).send("Contact not found");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const { error } = addSchemaFavorite.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const result = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
