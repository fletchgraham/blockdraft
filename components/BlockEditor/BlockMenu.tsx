import {
  TrashIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PencilSquareIcon,
} from "@/components/icons";

import { Block } from "@/types/block";

type BlockMenuProps = {
  block: Block;
  onEditBlock: (block: Block) => void;
  onBlockMove: (block: Block, target: "inbox" | "draft") => void;
  deleteModalId: string;
};

export const BlockMenu = ({
  block,
  onEditBlock,
  onBlockMove,
  deleteModalId,
}: BlockMenuProps) => {
  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-link">
        <ThreeDotsIcon />
      </summary>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
      >
        <li>
          <button
            onClick={() =>
              onBlockMove(block, block.draftId ? "inbox" : "draft")
            }
          >
            {/* arrow left or right depending */}
            {block.draftId ? <ArrowLeftCircleIcon /> : <ArrowRightCircleIcon />}
            Move to {block.draftId ? "Inbox" : "Draft"}
          </button>
        </li>
        <li>
          <button onClick={() => onEditBlock(block)}>
            <PencilSquareIcon />
            Edit
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              (
                document.getElementById(deleteModalId) as HTMLDialogElement
              ).showModal()
            }
          >
            <TrashIcon />
            Delete
          </button>
        </li>
      </ul>
    </details>
  );
};

const ThreeDotsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="gray"
      viewBox="-5 0 5 24"
      className="w-2 h-6 sm:opacity-0 sm:transition sm:group-hover:opacity-100"
    >
      <circle cx="0" cy="6" r="1.5" />
      <circle cx="0" cy="12" r="1.5" />
      <circle cx="0" cy="18" r="1.5" />
    </svg>
  );
};
