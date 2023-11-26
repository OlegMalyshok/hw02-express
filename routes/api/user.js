const express = require("express");

const UserController = require("../../models/userControllers");

const { authenticate } = require("../../middleware/auth");

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, UserController.register);
router.post("/login", jsonParser, UserController.login);
router.post("/logout", authenticate, UserController.logout);
router.get("/current", authenticate, UserController.current);
