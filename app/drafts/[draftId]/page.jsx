import { getCollection } from "../../../lib/db";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import { getUserFromCookies } from "../../../lib/getUser";

async function getDraft(draftId) {
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

export default async function DraftPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  let draft;

  try {
    const awaitedParams = await params;
    const draftId = awaitedParams.draftId;
    draft = await getDraft(draftId);
  } catch (e) {
    console.error(e);
    notFound();
  }

  if (!draft) {
    notFound();
  }

  if (draft.userId !== user.userId) {
    notFound();
  }

  return (
    <div>
      <h1>{draft.name}</h1>
    </div>
  );
}
