"use client";

import React, { useState } from "react";

const processImageFromUrl = async (
  url,
  targetSize = { width: 200, height: 150 }
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle CORS issues
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const { width: targetWidth, height: targetHeight } = targetSize;

      // Calculate aspect ratio and resize
      const aspectRatio = img.width / img.height;
      let newWidth, newHeight;

      if (aspectRatio > targetWidth / targetHeight) {
        newHeight = targetHeight;
        newWidth = aspectRatio * newHeight;
      } else {
        newWidth = targetWidth;
        newHeight = targetWidth / aspectRatio;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw the resized and cropped image on the canvas
      ctx.drawImage(
        img,
        (newWidth - targetWidth) / -2,
        (newHeight - targetHeight) / -2,
        newWidth,
        newHeight
      );

      // Convert the canvas content to a base64 string
      const base64String = canvas.toDataURL("image/jpeg", 0.5); // Adjust quality as needed
      resolve(base64String);
    };

    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

const generateHtmlForClipboard = async (blocks) => {
  const processedBlocks = await Promise.all(
    blocks.map(async (block) => {
      const { content, summary, thumbnailUrl, url, title } = block;

      let processedImage = null;
      if (thumbnailUrl) {
        try {
          processedImage = await processImageFromUrl(thumbnailUrl);
        } catch (error) {
          console.error("Error processing image:", error);
        }
      }

      return `
        <div style="margin-bottom: 1em;">
          ${content ? `<h2>${content}</h2>` : ""}
          ${
            processedImage
              ? `<img src="${processedImage}" alt="Thumbnail" style="width:200px;height:150px;" />`
              : ""
          }
          ${title ? `<a href="${url}" target="_blank">${title}</a>` : ""}
          ${summary ? `<p>${summary}</p>` : ""}
        </div>
      `;
    })
  );

  return processedBlocks.join("\n");
};

export default function CopyToClipboard({ blocks }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const copyToClipboard = async () => {
    setIsProcessing(true);

    try {
      const htmlContent = await generateHtmlForClipboard(blocks);

      // Create a temporary element to hold the HTML
      const tempElement = document.createElement("div");
      tempElement.innerHTML = htmlContent;
      document.body.appendChild(tempElement);

      // Select and copy the content
      const range = document.createRange();
      range.selectNode(tempElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        document.execCommand("copy");
        alert("Copied to clipboard!");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }

      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(tempElement);
    } catch (error) {
      console.error("Error generating HTML:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      className={`btn btn-primary mt-4 ${isProcessing ? "loading" : ""}`}
      onClick={copyToClipboard}
      disabled={isProcessing}
    >
      {isProcessing ? "Processing..." : "Copy to Clipboard"}
    </button>
  );
}
