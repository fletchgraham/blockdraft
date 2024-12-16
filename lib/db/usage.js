"use server";

import { ObjectId } from "mongodb";
import { auth } from "@/auth"; // Use your auth function
import { getCollection } from "@/lib/db";

export const getUserUsage = async () => {
  // Retrieve the current authenticated user
  const user = (await auth())?.user;

  

  try {
    const usageCollection = await getCollection("userUsage");
   

    // Attempt to find the user's usage data based on user ID and billing cycle start date
    const userUsage = await usageCollection.findOne({
      userId: ObjectId.createFromHexString(user.userId),
    });

    // If no usage data is found, return default values with limit as 100
    if (!userUsage) {
      return { currentUsage: 0, limit: 100 };
    }

    // Return the user's current usage and their limit
    return {
      currentUsage: userUsage.blocksSummarized || 0, // Ensure `blocksSummarized` defaults to 0 if missing
      limit: userUsage.limit || 100, // Default to 100 if no limit is found
    };
  } catch (error) {
    // Log any errors encountered during the database operation
    console.error("Error fetching user usage data:", error);
    return { currentUsage: 0, limit: 100 }; // Fallback to default values on error
  }
};
