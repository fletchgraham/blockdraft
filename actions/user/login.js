"use server";

import { getCollection } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

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
