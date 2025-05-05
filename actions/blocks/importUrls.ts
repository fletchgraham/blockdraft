"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";
import { createBlockFromUrl } from "@/lib/db/blocks";

const getCleanUrlsFromFormData = (formData) => {
  let urls = formData.get("urls");

  // if they didn't give us anything just redirect back to import urls page
  if (!urls) {
    return redirect("/import-urls");
  }

  // for now just return if they didn't give us a string
  if (typeof urls !== "string") {
    return redirect("/");
  }

  // split into an array
  urls = urls.split("\n");

  // get rid of any empty ones
  urls = urls.filter((url) => url.trim().length > 0);

  // trim and return
  return urls.map((url) => url.trim());
};

export const importUrls = async (prevState, formData) => {
  const user = (await auth())?.user;
  if (!user) {
    return redirect("/");
  }

  if (!formData) {
    return "No form data";
  }

  if (!formData.get("urls")) {
    return "Please paste some URLs above.";
  }

  const urls = getCleanUrlsFromFormData(formData);
  const blocks = await Promise.all(urls.map(createBlockFromUrl));

  // add the user id to each block
  blocks.forEach((block) => {
    block.userId = ObjectId.createFromHexString(user.userId);
  });

  const blocksCollection = await getCollection("blocks");
  await blocksCollection.insertMany(blocks);
  return redirect("/edit");
};
