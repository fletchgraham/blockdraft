import { useState } from "react";

export default function DeleteDraftModal({ draft, onDelete }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [moveBlocksToInbox, setMoveBlocksToInbox] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    if (confirmationText.toLowerCase() === "delete") {
      onDelete(draft._id, moveBlocksToInbox);
    }
  };

  return (
    <dialog id={`delete-modal-${draft._id}`} className="modal">
      <form method="dialog" className="modal-box" onSubmit={handleDelete}>
        <h3 className="font-bold text-lg">Delete Draft</h3>
        <p className="py-4">
          Are you sure you want to delete "{draft.name}"? This action cannot be
          undone.
        </p>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Type "delete" to confirm</span>
          </label>
          <input
            type="text"
            placeholder="delete"
            className="input input-bordered"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </div>
        <div className="form-control mb-4">
          <label className="label cursor-pointer">
            <span className="label-text">Move blocks back to inbox</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={moveBlocksToInbox}
              onChange={(e) => setMoveBlocksToInbox(e.target.checked)}
            />
          </label>
        </div>
        <div className="modal-action">
          <button
            type="submit"
            className="btn btn-error"
            disabled={confirmationText.toLowerCase() !== "delete"}
          >
            Confirm Delete
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              document.getElementById(`delete-modal-${draft._id}`).close();
              setConfirmationText("");
              setMoveBlocksToInbox(false);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
