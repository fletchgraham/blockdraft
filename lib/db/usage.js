"use server";

import { ObjectId } from "mongodb";
import { auth } from "@/auth"; // Use your auth function
import { getCollection } from "@/lib/db";

export const getUserUsage = async () => {
  const user = (await auth())?.user;
  if (!user) {
    return { currentUsage: 0, limit: 100 }; // Defaults for unauthenticated users
  }

  const usageCollection = await getCollection("userUsage");
  const BILLING_START_DATE = new Date("2024-12-09");

  // Find or initialize the user's usage data
  const userUsage = await usageCollection.findOne({
    userId: ObjectId.createFromHexString(user.userId),
    billingCycleStart: BILLING_START_DATE,
  });

  return {
    currentUsage: userUsage?.blocksSummarized || 0,
    limit: 100, // Static limit for now
  };
};
