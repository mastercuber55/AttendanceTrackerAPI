import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../utils/User.mjs"
import notifyDiscord from "../utils/notifyDiscord.mjs"

export async function handler(event) {
  await mongoose.connect(process.env.MONGO_URI);

  const { username, password } = JSON.parse(event.body);
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = await User.findOne({ username });
  if (user) {
    return { statusCode: 400, body: "already exists" };
  }

  user = new User({ username, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

  const result = await notifyDiscord(`**\`${username}\`** just signed up. 😻`);
  return { statusCode: 200, body: JSON.stringify({ token }) };
}
