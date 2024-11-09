"use server";

import { redirect } from "next/navigation";
import { getCollection } from "../lib/db";

function isLongerThan(str, length) {
  return str.length > length;
}

function isShorterThan(str, length) {
  return str.length < length;
}

export const createDraft = async (prevState, formData) => {
  const errors = {};

  const draft = {
    name: formData.get("draftName"),
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

export const getDrafts = async () => {
  const draftCollection = await getCollection("drafts");
  return await draftCollection.find().toArray();
};
