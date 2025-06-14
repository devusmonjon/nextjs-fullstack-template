import User from "@/database/user.model";
import { hash } from "bcrypt";
import mongoose, { ConnectOptions } from "mongoose";

let isConncected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return process.exit("MISSING MONGODB_URI in the .env file");
  }

  if (!process.env.DB_NAME) {
    return process.exit("MISSING DB_NAME in the .env file");
  }

  if (isConncected) {
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: process.env.DB_NAME,
      autoCreate: true,
    };
    await mongoose.connect(process.env.MONGODB_URI!, options);
    isConncected = true;
    console.log("MongoDB is connected");
    const admins_count = await User.countDocuments();
    console.log(admins_count);
    if (admins_count === 0) {
      const password = process.env.ADMIN_PASSWORD;
      const passwordHash = await hash(password!, 10);
      const user = {
        fullName: process.env.ADMIN_NAME || "Superadmin",
        email: process.env.ADMIN_EMAIL || "admin@gmail.com",
        password: passwordHash,
        role: "admin",
      };
      await User.create();
      console.log(
        "Default Admin successfully created: ",
        JSON.stringify({ ...user, password }, null, 2)
      );
    }
  } catch (err) {
    console.log(err);
  }
};
