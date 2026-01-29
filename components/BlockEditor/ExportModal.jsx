"use client";

import { useState } from "react";

const MODAL_ID = "export-modal-id";

export default function ExportModal({ blocks }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExport = () => {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate + "T23:59:59") : new Date();

    const filteredBlocks = blocks.filter((block) => {
      if (block.type === "custom") return false;
      const contentDate = new Date(block.contentDate);
      return contentDate >= start && contentDate <= end;
    });

    if (filteredBlocks.length === 0) {
      alert("No blocks found in the selected date range.");
      return;
    }

    // Create CSV content
    const headers = ["url", "title", "image_url"];
    const rows = filteredBlocks.map((block) => [
      escapeCsvField(block.url || ""),
      escapeCsvField(block.title || ""),
      escapeCsvField(block.thumbnailUrl || ""),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `blocks-export-${startDate || "all"}-to-${endDate || "now"}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close modal
    document.getElementById(MODAL_ID).close();
  };

  const escapeCsvField = (field) => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  return (
    <dialog id={MODAL_ID} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Export Blocks</h3>
        <p className="py-2 text-sm opacity-70">
          Select a date range to export blocks as CSV.
        </p>

        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleExport}>
            Export CSV
          </button>
          <button
            className="btn"
            onClick={() => document.getElementById(MODAL_ID).close()}
          >
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function openExportModal() {
  document.getElementById(MODAL_ID).showModal();
}
