import { compare } from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should me min 6 characters");
  let userExist = await User.findOne({ email }).exec();
  if (userExist) return res.status(400).send("Email is taken");

  const user = new User(req.body);
  try {
    await user.save();
    console.log("USER CREATED", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("CREATE USER FAILED", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).exec();
    // console.log("USER EXIST", user);
    if (!user) res.status(400).send("User with that email not found");
    // compare
    user.comparePassword(password, (err, match) => {
      console.log("COMPARE PASSWORD IN LOGIN ERR");
      if (!match || err) return res.status(400).send("Wrong password");
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.log("LOGIN ERROR", err);
    res.status(400).send("Signin fail");
  }
};
