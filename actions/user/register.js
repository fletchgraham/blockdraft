"use server";

import { getCollection } from "@/lib/db";
import bcrypt from "bcryptjs";

export const register = async (prevState, formData) => {
  const errors = {};

  const username = formData.get("username");
  const password = formData.get("password");

  // Validate username
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = "Username must be alphanumeric";
  }
  if (username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  if (username.length > 20) {
    errors.username = "Username must be at most 20 characters";
  }

  // Check if the username is already taken
  const userCollection = await getCollection("users");
  const existingUser = await userCollection.findOne({ username });
  if (existingUser) {
    errors.username = "Username is already taken";
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
  await userCollection.insertOne({ username, password: hashedPassword });

  return { success: true };
};
