"use server";

import { getCollection } from "@/lib/db";
import bcrypt from "bcryptjs";

export const register = async (prevState, formData) => {
  const errors = {};

  const email = formData.get("email");
  const password = formData.get("password");

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  // Check if the email is already taken
  const userCollection = await getCollection("users");
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    errors.email = "Email is already taken";
  }

  // Validate password
  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      success: false,
    };
  }

  // Hash password and save user to database
  const hashedPassword = bcrypt.hashSync(password, 10);
  await userCollection.insertOne({ email, password: hashedPassword });

  return { success: true };
};
