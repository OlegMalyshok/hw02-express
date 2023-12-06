const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const gravatar = require("gravatar");
const crypto = require("node:crypto");

const User = require("../models/user");
const sendEmail = require("../helpers/sendEmail");

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function register(req, res, next) {
  const { email, password } = req.body;
  const { error } = schemaUser.validate(req.body);

  try {
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error: Email and password are required" });
    }

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res.status(409).json({ message: " Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const verifyToken = crypto.randomUUID();

    await sendEmail({
      to: email,
      subject: "Welcome to ContactsList",
      html: `To confirm your registration please click on the <a href="http://localhost:3005/users/verify/${verifyToken}">link</a>`,
      text: `To confirm your registration please open the link http://localhost:3005/users/verify/${verifyToken}`,
    });

    const newUser = await User.create({
      email,
      verifyToken,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const { error } = schemaLogin.validate(req.body);

  try {
    if (error) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).exec();

    if (user === null) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch === false) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (user.verify !== true) {
      return res.status(401).send({ message: "Your account is not verified" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    user.token = token;

    await user.save();

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const { email, subscription } = req.user;
    res.json({
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  const { token } = req.params;
  console.log(token);

  try {
    const user = await User.findOne({
      verifyToken: token,
    }).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verifyToken: null,
    });

    res.send({ message: "Email confirm successfuly" });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current, verify };
