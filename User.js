import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "holiday", "mustgo"],
    required: true,
  },
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
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
      enum: ["present", "absent", "holiday"],
    },
    default: {},
  },
});

UserSchema.methods.setStatus = function(date, status) {
  this.attendance.set(date, status)
  if(status == "present") this.totalPresent += 1;
  else if(status == "absent") this.totalAbsent += 1;

  return this.save()
}

const User = model("User", UserSchema);

export default User;
