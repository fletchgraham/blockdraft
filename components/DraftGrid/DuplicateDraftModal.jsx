import { useState } from "react";

export default function DuplicateDraftModal({ draft, onDuplicate }) {
  const [inputText, setInputText] = useState(draft.name + " Copy");

  const handleDuplicate = (e) => {
    e.preventDefault();
    if (inputText) {
      onDuplicate(draft._id, inputText.trim());
      document.getElementById(`duplicate-modal-${draft._id}`).close();
      setInputText("");
    }
  };

  return (
    <dialog id={`duplicate-modal-${draft._id}`} className="modal">
      <form method="dialog" className="modal-box" onSubmit={handleDuplicate}>
        <h3 className="font-bold text-lg">Duplicate Draft</h3>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Type a name for the new draft.</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Duplicate
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              document.getElementById(`duplicate-modal-${draft._id}`).close();
              setInputText("");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
