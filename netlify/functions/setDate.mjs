import genCode from '../utils/genCode.mjs';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../utils/User.mjs";

// --- Helper (if not already defined elsewhere) ---
function verifyToken(headers) {
  const token = headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// --- Main Handler ---
export default async function (event) {
  const method = event.method || event.httpMethod;
  if (method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  await mongoose.connect(process.env.MONGO_URI);

  const userData = verifyToken(event.headers);
  if (!userData) {
    return new Response("Unauthorized", { status: 401, });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { date, status } = body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response("Invalid or missing date (YYYY-MM-DD expected)", { status: 400 });
  }

  if (!['present', 'absent', 'holiday'].includes(status)) {
    return new Response("Invalid status value", { status: 400 });
  }

  try {
    const user = await User.findById(userData.id);
    if (!user) return new Response("User not found", { status: 404 });

    user.attendance.set(date, status);
    await user.save();

    const code = genCode("SCS");
    await notifyDiscord(`${code} | ifykyk`);

    return new Response(JSON.stringify({
      message: `Marked ${date} as ${status}`,
      updated: { [date]: status }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const code = genCode();
    await notifyDiscord(`${code} | Error for user ${user?.username ?? 'unknown'}`);
    return new Response(`failed | ${code}`, { status: 500 });
  }
};
