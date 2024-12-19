"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import * as cheerio from "cheerio";

import { auth } from "@/auth";
import { getCollection } from "@/lib/db";

const extractContentDate = ($) => {
  const dateSelectors = [
    "meta[property='article:published_time']", // Open Graph property
    "meta[name='article:published_time']", // Some alternative formats
    "meta[name='publish-date']",
    "meta[name='pubdate']",
    "time[datetime]",
  ];

  for (const selector of dateSelectors) {
    const dateValue =
      $(selector).attr("content") || $(selector).attr("datetime");
    if (dateValue) {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  return null;
};

const createBlockFromUrl = async (url) => {
  const block = {
    url: url,
    title: "",
    thumbnailUrl: "",
    contentDate: new Date(),
  };

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);

  // Get the image URL from meta tags
  block.thumbnailUrl =
    $("meta[property='og:image']").attr("content") ||
    $("meta[name='twitter:image']").attr("content") ||
    "";

  block.title = $("title").text() || "Untitled";

  // Attempt to extract content date from the page
  const extractedDate = extractContentDate($);
  if (extractedDate) {
    block.contentDate = extractedDate;
  }

  return block;
};

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
