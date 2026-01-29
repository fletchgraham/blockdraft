export default function MoveToSectionModal({
  modalId,
  sections,
  onSelectSection,
  onClose,
}) {
  const handleSelect = (section) => {
    onSelectSection(section);
    document.getElementById(modalId).close();
  };

  const handleClose = () => {
    onClose();
    document.getElementById(modalId).close();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Move to Section</h3>
        {sections.length === 0 ? (
          <p className="text-gray-500 py-4">
            No sections available. Create a custom block to use as a section
            header.
          </p>
        ) : (
          <ul className="menu bg-base-200 rounded-box">
            {sections.map((section) => (
              <li key={section._id}>
                <button
                  className="text-left"
                  onClick={() => handleSelect(section)}
                >
                  {section.content}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="modal-action">
          <button className="btn btn-neutral" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
