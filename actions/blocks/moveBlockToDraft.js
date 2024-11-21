"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";

export const moveBlockToDraft = async (formData) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  const block = await blocksCollection.findOne({
    _id: ObjectId.createFromHexString(formData.get("blockId")),
    userId: ObjectId.createFromHexString(user.id),
  });

  if (!block) {
    // todo: show error instead
    return redirect("/");
  }

  const draftsCollection = await getCollection("drafts");
  const draft = await draftsCollection.findOne({
    _id: ObjectId.createFromHexString(formData.get("draftId")),
  });

  // set draftId on block
  block.draftId = draft._id;

  // update the block in the database
  await blocksCollection.updateOne(
    { _id: block._id },
    { $set: { draftId: block.draftId } }
  );

  if (!draft) {
    // todo show error instead
    return redirect("/");
  }
};
