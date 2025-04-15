import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/User';
import notifyDiscord from '@/utils/discord';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).send('Method Not Allowed');

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Invalid username');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    await notifyDiscord(`**\`${username}\`** just logged in. 😎`);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
}