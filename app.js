const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("node:path");

require("./db");
require("dotenv").config();

const authenticate = require("./middleware/auth");

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/user");
const userAvatarRouter = require("./routes/api/usersAvatar");

const app = express();

app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authenticate, contactsRouter);
app.use("/users", userRouter);
app.use("/user", authenticate, userAvatarRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
