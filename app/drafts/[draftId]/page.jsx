import { getCollection } from "../../../lib/db";
import { ObjectId } from "mongodb";

async function getDraft(draftId) {
  const draftCollection = await getCollection("drafts");
  const draftDoc = await draftCollection.findOne({
    _id: ObjectId.createFromHexString(draftId),
  });
  const draft = {
    _id: draftDoc._id.toString(),
    name: draftDoc.name,
  };
  return draft;
}

export default async function DraftPage({ params }) {
  const awaitedParams = await params;
  const draftId = awaitedParams.draftId;
  const draft = await getDraft(draftId);
  return (
    <div>
      <h1>{draft.name}</h1>
    </div>
  );
}
