import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import genCode from "../utils/genCode.js";
import User from "../User.js";;

export default async function handler(req, res) {
    if (req.method !== "PATCH") return res.status(405).send("Method Not Allowed");
  
    try {
      await mongoose.connect(process.env.MONGO_URI);
  
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).send("no token provided");
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).send("invalid token");

      const { date, status } = await JSON.parse(req.body)
  
      user.setStatus(date, status)
      
      return res.status(200).send("success");
  
    } catch (err) {
      console.error(err);
      return res.status(500).send(genCode());
    }
  }