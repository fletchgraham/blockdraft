function truncateTextToTokenLimit(text, tokenLimit = 1000) {
  // Estimate token count by splitting on spaces and limiting length
  const words = text.split(/\s+/);
  const averageTokenLength = 4; // Average GPT token length in characters

  // Approximate token count by character length
  let tokenCount = 0;
  let truncatedText = "";

  for (const word of words) {
    // Estimate token contribution of the word
    tokenCount += Math.ceil(word.length / averageTokenLength);

    // Stop adding words if the token limit is reached
    if (tokenCount > tokenLimit) {
      break;
    }

    truncatedText += word + " ";
  }

  return truncatedText.trim();
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure this is set in .env

const SYSTEM_PROMPT = `
You are tasked with creating concise, engaging summaries of articles for a newsletter. The goal is to provide readers with a brief yet informative snapshot of each article, highlighting the key points in an accessible and interesting manner. Each summary should be a single paragraph of 1-3 sentences and include the following elements:

Main Point: Summarize the core issue or event described in the article, capturing the essence of the news or development.

Details: If necessary, briefly expand on the main point by mentioning any critical details that support or explain the situation. Include relevant parties, actions, outcomes, or potential impacts.

Tone and Style: Use a neutral and straightforward tone that is easy to understand. Avoid jargon, and make the summaries accessible to a broad audience. Avoid adverbs and favor subject-verb-object sentence structure. Be incredibly brief and concise. Favor shorter, more direct responses. Avoid the word showcase.

Contextual Information: Where relevant, provide background or contextual information that helps the reader understand why the topic is important or noteworthy for someone interested in realistic visual art.

Length: Keep each summary super concise, ideally between 1 to 3 sentences.
`;

export async function summarizeText(text) {
  const clippedText = truncateTextToTokenLimit(text, 128000);

  const data = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Please give a short summary of the following text:\n\n${clippedText}`,
      },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to summarize: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Error summarizing text: ${error.message}`);
    return `Error: ${error.message}`;
  }
}
