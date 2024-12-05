"use server";

import { getCollection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { isAlphaNumeric, isLongerThan, isShorterThan } from "@/lib/validators";

export const register = async (prevState, formData) => {
  const errors = {};

  const ourUser = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // check the username and update the errors object
  if (!isAlphaNumeric(ourUser.username)) {
    errors.username = "Username must be alphanumeric";
  }

  if (isShorterThan(ourUser.username, 3)) {
    errors.username = "Username must be at least 3 characters";
  }

  if (isLongerThan(ourUser.username, 20)) {
    errors.username = "Username must be at most 20 characters";
  }

  // check if the username is already taken
  const userCollection = await getCollection("users");
  const existingUser = await userCollection.findOne({
    username: ourUser.username,
  });
  if (existingUser) {
    errors.username = "Username is already taken";
  }

  // check the password and update the errors object
  if (isShorterThan(ourUser.password, 8)) {
    errors.password = "Password must be at least 8 characters";
  }

  if (errors.username || errors.password) {
    return {
      errors: errors,
      success: false,
    };
  }

  // salt generation and password hashing
  const salt = bcrypt.genSaltSync(10);
  ourUser.password = bcrypt.hashSync(ourUser.password, salt);

  // store user in database
  const newUser = await userCollection.insertOne(ourUser);
  const userId = newUser.insertedId.toString();

  // create jwt value
  const token = jwt.sign(
    { userId: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    process.env.JWTSECRET
  );

  // log user in with a cookie
  (await cookies()).set("blockdraft", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
  });

  return {
    success: true,
  };
};
