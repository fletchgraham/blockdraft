"use server";

import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";
import { isShorterThan, isLongerThan } from "@/lib/validators";

export const createDraft = async (prevState, formData) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  let error;

  const draft = {
    name: formData.get("draftName"),
    userId: ObjectId.createFromHexString(user.userId),
    createdAt: new Date(),
  };

  if (await isShorterThan(draft.name, 3)) {
    error = "Draft name must be at least 3 characters";
    return {
      error,
      success: false,
    };
  }

  if (await isLongerThan(draft.name, 40)) {
    error = "Draft name must be at most 40 characters";
    return {
      error,
      success: false,
    };
  }

  const draftCollection = await getCollection("drafts");
  await draftCollection.insertOne(draft);

  return redirect("/drafts");
};
