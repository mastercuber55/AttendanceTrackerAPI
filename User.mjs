import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema({
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', "holiday"],
    required: true,
  }
});

const UserSchema = new Schema({
  name: String,
  password: String,
  targetAttendance: {
    type: Number,
    default: 80,
  },
  totalPresent: {
    type: Number,
    default: 0,
  },
  totalAbsent: {
    type: Number,
    default: 0,
  },
  attendance: {
    type: Map,
    of: {
      type: String,
      enum: ['present', 'absent', 'holiday'],
    },
    default: {},
  },
});

const User = model("User", UserSchema);

export default User;