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
  const errors = {};

  const draft = {
    name: formData.get("draftName"),
    userId: ObjectId.createFromHexString(user.id),
    createdAt: new Date(),
  };

  if (isShorterThan(draft.name, 3)) {
    errors.draftName = "Draft name must be at least 3 characters";
  }

  if (isLongerThan(draft.name, 40)) {
    errors.draftName = "Draft name must be at most 20 characters";
  }

  if (errors.draftName) {
    return {
      errors: errors,
      success: false,
    };
  }

  const draftCollection = await getCollection("drafts");
  await draftCollection.insertOne(draft);

  return redirect("/drafts");
};
