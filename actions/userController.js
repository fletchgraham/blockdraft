"use server";
import { getCollection } from "../lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

function isAlphaNumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}

function isLongerThan(str, length) {
  return str.length > length;
}

function isShorterThan(str, length) {
  return str.length < length;
}

export const logout = async function () {
  (await cookies()).delete("blockdraft");
  redirect("/");
};

export const login = async (prevState, formData) => {
  // get the user from the database
  const userCollection = await getCollection("users");
  const user = await userCollection.findOne({
    username: formData.get("username"),
  });

  // check if the user exists
  if (!user) {
    return {
      errors: {
        username: "User not found",
      },
      success: false,
    };
  }

  // check if the password is correct
  if (!bcrypt.compareSync(formData.get("password"), user.password)) {
    return {
      errors: {
        password: "Incorrect password",
      },
      success: false,
    };
  }

  // create jwt value
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    process.env.JWTSECRET
  );

  // log user in with a cookie
  (await cookies()).set("blockdraft", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
  });

  return redirect("/");
};

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

  // hash the password
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
