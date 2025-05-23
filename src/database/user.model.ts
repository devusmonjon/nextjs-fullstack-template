import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
