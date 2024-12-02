"use server";
import { Resend } from "resend";

export async function sendFeedback(feedbackText, email) {
  const resend = new Resend(process.env.AUTH_RESEND_KEY);

  try {
    await resend.emails.send({
      from: "feedback@blockdraft.ai",
      to: "fletcher@blockdraft.ai",
      subject: "New Feedback",
      text: `From: ${email}\n\n${feedbackText}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending feedback:", error);
    return { success: false, message: error.message };
  }
}
