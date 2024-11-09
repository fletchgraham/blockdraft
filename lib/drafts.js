import { getCollection } from "/lib/db";
import { ObjectId } from "mongodb";

export async function getDraft(draftId) {
  const draftCollection = await getCollection("drafts");
  const draftDoc = await draftCollection.findOne({
    _id: ObjectId.createFromHexString(draftId),
  });
  const draft = {
    _id: draftDoc._id.toString(),
    name: draftDoc.name,
    userId: draftDoc.userId,
  };
  return draft;
}

export async function getDrafts(userId) {
  const draftCollection = await getCollection("drafts");
  const draftDocs = await draftCollection.find({ userId }).toArray();
  const drafts = draftDocs.map((draftDoc) => {
    return {
      _id: draftDoc._id,
      name: draftDoc.name,
    };
  });
  return drafts;
}
