import genCode from '../utils/genCode.mjs';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../utils/User.mjs'); 

// --- Main Handler ---
export default async function (event) {
  const method = event.httpMethod;
  if(method != "POST")
    return { statusCode: 405, body: 'Method Not Allowed' };

  await mongoose.connect(process.env.MONGO_URI);

  const userData = verifyToken(event.headers);
  if (!userData) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { date, status } = body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { statusCode: 400, body: 'Invalid or missing date (YYYY-MM-DD expected)' };
  }

  if (!['present', 'absent', 'holiday'].includes(status)) {
    return { statusCode: 400, body: 'Invalid status value' };
  }

  try {
    const user = await User.findById(userData.id);
    if (!user) return { statusCode: 404, body: 'User not found' };

    user.attendance.set(date, status);
    await user.save();

    const code = getCode("SCS")

    await notifyDiscord(`${code} | ifykyk`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Marked ${date} as ${status}`,
        updated: { [date]: status }
      }),
    };
  } catch (err) {
    const code = genCode()
    await notifyDiscord(`${code} | An error occured while **${user.username}** tried to set a date status.`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'failed', errcode: code }),
    };
  }
};