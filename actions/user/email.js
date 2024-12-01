"use server";

import "server-only"; // Enforce server-only execution

export async function subscribeToMailingList(email) {
  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  try {
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email,
          groups: [GROUP_ID],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to subscribe.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error subscribing to mailing list:", error);
    return { success: false, message: error.message };
  }
}
