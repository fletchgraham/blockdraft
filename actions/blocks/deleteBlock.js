"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { getUserFromCookies } from "@/lib/getUser";
import { getCollection } from "@/lib/db";

export const deleteBlock = async (formData) => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  await blocksCollection.deleteOne({
    _id: ObjectId.createFromHexString(formData.get("blockId")),
    userId: ObjectId.createFromHexString(user.userId),
  });
};
