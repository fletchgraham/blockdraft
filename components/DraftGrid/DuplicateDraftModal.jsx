import { useState } from "react";
import { getTodayFormatted, getTomorrowFormatted } from "@/lib/dateUtils";

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

  const setToday = () => {
    setInputText(getTodayFormatted());
  };

  const setTomorrow = () => {
    setInputText(getTomorrowFormatted());
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
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline btn-sm flex-1"
              onClick={setToday}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm flex-1"
              onClick={setTomorrow}
            >
              Tomorrow
            </button>
          </div>
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
