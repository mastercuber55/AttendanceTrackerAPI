import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../utils/User.mjs"
import notifyDiscord from "../utils/notifyDiscord.mjs"

export async function handler(event) {
  await mongoose.connect(process.env.MONGO_URI);

  const { username, password } = JSON.parse(event.body);
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { statusCode: 401, body: "Invalid email or password" };
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

  require("../utils/notifyDiscord.mjs")(`**\`${username}\`** just signed up. 😻`)

  const result = await notifyDiscord(`**\`${username}\`** just signed up. 😻`);
  return { statusCode: 200, body: JSON.stringify({ token }) };
}
