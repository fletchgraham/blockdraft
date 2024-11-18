export function cleanMongoDocument(doc) {
  const cleanedDoc = { ...doc };
  if (cleanedDoc._id) cleanedDoc._id = cleanedDoc._id.toString();
  if (cleanedDoc.draftId) cleanedDoc.draftId = cleanedDoc.draftId.toString();
  delete cleanedDoc.userId;
  return cleanedDoc;
}
