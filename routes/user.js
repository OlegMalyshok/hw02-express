const express = require("express");

const UserController = require("../models/userControllers");

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, UserController.register);
router.post("/login", jsonParser, UserController.login);
