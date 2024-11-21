"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export const logout = async function () {
  await signOut();
  redirect("/");
};
