const fs = require("node:fs/promises");
const path = require("node:path");
const Jimp = require("jimp");

const User = require("../models/user");

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatar === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.join(__dirname, "..", "public/avatars", user.avatar));
  } catch (error) {
    next(error);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const filePath = path.join(__dirname, "..", "tmp", req.file.filename);

    const image = await Jimp.read(filePath);
    await image.resize(250, 250).write(filePath);

    await fs.rename(
      filePath,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const avatarURL = `/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename, avatarURL },
      { new: true }
    ).exec();

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAvatar, updateAvatar };
