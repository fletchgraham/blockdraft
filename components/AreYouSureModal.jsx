export default function AreYouSureModal({
  modalId,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
}) {
  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            {/* Cancel button */}
            <button
              className="btn btn-neutral"
              onClick={() => document.getElementById(modalId).close()}
            >
              Cancel
            </button>
            {/* Confirm button */}
            <button
              className="btn btn-error"
              onClick={() => {
                onConfirm();
                document.getElementById(modalId).close();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
