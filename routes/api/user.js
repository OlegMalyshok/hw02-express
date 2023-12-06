const express = require("express");
const router = express.Router();

const UserController = require("../../controllers/userControllers");

const authenticate = require("../../middleware/auth");

const jsonParser = express.json();

router.post("/register", jsonParser, UserController.register);
router.post("/login", jsonParser, UserController.login);
router.post("/logout", authenticate, UserController.logout);
router.get("/current", authenticate, UserController.current);
router.get("/verify/:token", UserController.verify);

module.exports = router;
