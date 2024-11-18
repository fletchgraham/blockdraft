import * as cheerio from "cheerio";

// Headers to mimic a real browser
const SCRAPING_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

// Function to fetch and parse the page content
export async function fetchPageText(url) {
  try {
    const response = await fetch(url, { headers: SCRAPING_HEADERS });
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract readable text from <p> tags, filtering out empty or irrelevant ones
    const paragraphs = $("p")
      .map((i, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 50); // Filter out short/uninformative text

    // Join paragraphs into a single text
    return paragraphs.join("\n\n");
  } catch (error) {
    console.error(`Error fetching page content: ${error.message}`);
    return null; // Return null if an error occurs
  }
}
