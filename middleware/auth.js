const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization = " " } = req.headers;
  const [bearer, token] = authorization.split(" ", 2);

  if (bearer !== "Bearer") {
    console.log("Bearer token not found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ token });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.verify !== true) {
      return res.status(401).send({ message: "Your account is not verified" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error during authentication:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticate;
