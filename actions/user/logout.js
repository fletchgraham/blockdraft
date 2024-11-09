"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const logout = async function () {
  (await cookies()).delete("blockdraft");
  redirect("/");
};
