"use client";
import { useState, useEffect } from "react";

export default function EditBlockModal({ block, onEditBlock, onClose }) {
  const [formValues, setFormValues] = useState({
    title: "",
    url: "",
    thumbnailUrl: "",
    summary: "",
  });

  const modalId = "edit-block-modal-id";

  // Populate form with block data when it opens
  useEffect(() => {
    if (block) {
      setFormValues({
        title: block.title || "",
        url: block.url || "",
        thumbnailUrl: block.thumbnailUrl || "",
        summary: block.summary || "",
      });
    }
  }, [block]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditBlock({
      ...block,
      ...formValues,
    });
    onClose();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Block</h3>
        <form onSubmit={handleSubmit} className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              className="input input-bordered w-full"
              value={formValues.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              name="url"
              placeholder="Enter URL"
              className="input input-bordered w-full"
              value={formValues.url}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              placeholder="Enter thumbnail URL"
              className="input input-bordered w-full"
              value={formValues.thumbnailUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Summary</label>
            <textarea
              name="summary"
              placeholder="Enter summary"
              className="textarea textarea-bordered w-full"
              value={formValues.summary}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn">
              Save Changes
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
