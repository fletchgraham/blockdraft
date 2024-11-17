"use client";

import React from "react";
import ReactDOMServer from "react-dom/server";

export default function CopyToClipboard({ blocks }) {
  // Function to copy HTML to clipboard
  const copyToClipboard = () => {
    // Use JSX to create the article structure
    const articleContent = (
      <div>
        {blocks.map((block) => (
          <div key={block._id} style={{ marginBottom: "1em" }}>
            {block.content && <h2>{block.content}</h2>}
            {block.thumbnailUrl && (
              <img
                src={block.thumbnailUrl}
                alt=""
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginBottom: "0.5em",
                }}
              />
            )}
            {block.title && (
              <p>
                <strong>
                  <a href={block.url} target="_blank" rel="noopener noreferrer">
                    {block.title}
                  </a>
                </strong>
              </p>
            )}
            {block.summary && (
              <p style={{ color: "#888", fontSize: "0.9em" }}>
                {block.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    );

    // Convert JSX to HTML
    const articleHtml = ReactDOMServer.renderToStaticMarkup(articleContent);

    // Copy HTML to clipboard
    const tempElement = document.createElement("div");
    tempElement.innerHTML = articleHtml;
    document.body.appendChild(tempElement);

    const range = document.createRange();
    range.selectNode(tempElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand("copy");
      alert("Article copied as rich text!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }

    selection.removeAllRanges();
    document.body.removeChild(tempElement);
  };

  return (
    <button className="btn btn-primary mt-4" onClick={copyToClipboard}>
      Copy to Clipboard
    </button>
  );
}
