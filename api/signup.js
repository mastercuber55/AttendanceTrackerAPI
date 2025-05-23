import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../User.js";
import genCode from "../utils/genCode.js";
import discord from "../utils/discord.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { username, password } = await JSON.parse(req.body);
    let user = await User.findOne({ username });

    if (user) return res.status(400).send("already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    await discord(`**\`${username}\`** just signed up. 😎`);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send(genCode());
  }
}
