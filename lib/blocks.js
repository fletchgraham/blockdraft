import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getUserFromCookies } from "./getUser";
import { getCollection } from "./db";

export const getBlocks = async () => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({ userId: ObjectId.createFromHexString(user.userId) })
    .toArray();

  return blocks;
};

export const getBlocksForDraft = async (draftId) => {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const blocksCollection = await getCollection("blocks");
  const blocks = await blocksCollection
    .find({
      draftId: ObjectId.createFromHexString(draftId),
    })
    .toArray();

  return blocks;
};
