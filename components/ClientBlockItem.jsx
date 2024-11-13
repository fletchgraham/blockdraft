// components/ClientBlockItem.jsx
"use client";

export default function ClientBlockItem({
  block,
  onMove,
  lists,
  currentListId,
}) {
  const handleMove = (selectedListId) => {
    if (selectedListId && selectedListId !== currentListId) {
      onMove(block, selectedListId);
    }
  };

  return (
    <li className="flex items-center border border-black p-4 bg-base-100 rounded-lg mb-2">
      <div className="flex-1">
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-primary hover:underline"
        >
          {block.title}
        </a>
        <p className="text-sm text-gray-500">{block.text}</p>
      </div>

      {/* Move Dropdown */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          M
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {lists
            .filter((list) => list.id !== currentListId) // Exclude the current list
            .map((list) => (
              <li key={list.id}>
                <button
                  onClick={() => handleMove(list.id)}
                >{`Move to List ${list.id}`}</button>
              </li>
            ))}
        </ul>
      </div>
    </li>
  );
}
