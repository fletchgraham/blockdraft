"use client";

const generateHtmlForClipboard = (blocks) => {
  return blocks
    .map((block) => {
      const { content, summary, thumbnailUrl, url, title } = block;

      return `
          <div>
            ${content ? `<h2>${content}</h2>` : ""}
            ${
              thumbnailUrl
                ? `<img src="${thumbnailUrl}" alt="Thumbnail" />`
                : ""
            }
            ${title ? `<a href="${url}" target="_blank">${title}</a>` : ""}
            ${summary ? `<p>${summary}</p>` : ""}
          </div>`;
    })
    .join("\n");
};

export default function CopyToClipboard({ blocks }) {
  // Function to copy to clipboard
  const copyToClipboard = () => {
    const htmlContent = generateHtmlForClipboard(blocks);
    navigator.clipboard
      .writeText(htmlContent)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Error copying to clipboard: ", err));
  };

  return (
    <>
      <button className="btn btn-primary mt-4" onClick={copyToClipboard}>
        Copy to Clipboard
      </button>
    </>
  );
}
