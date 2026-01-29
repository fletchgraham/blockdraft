"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";

export const archiveDraft = async (
  draftId: string
): Promise<{ success: boolean }> => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  const draftCollection = await getCollection("drafts");

  await draftCollection.updateOne(
    {
      _id: ObjectId.createFromHexString(draftId),
      userId: ObjectId.createFromHexString(user.userId), // ensure user owns the draft
    },
    {
      $set: { archived: true },
    }
  );

  return { success: true };
};
