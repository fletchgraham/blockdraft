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
  const actions = [
    {
      label: `Move to ${block.draftId ? "Inbox" : "Draft"}`,
      icon: block.draftId ? <ArrowLeftCircleIcon /> : <ArrowRightCircleIcon />,
      onClick: () => onBlockMove(block, block.draftId ? "inbox" : "draft"),
    },
    {
      label: "Edit",
      icon: <PencilSquareIcon />,
      onClick: () => onEditBlock(block),
    },
    {
      label: "Delete",
      icon: <TrashIcon />,
      onClick: () => {
        (
          document.getElementById(deleteModalId) as HTMLDialogElement
        ).showModal();
      },
    },
  ];

  return (
    <details className="dropdown dropdown-end">
      <summary className="btn btn-link">
        <ThreeDotsIcon />
      </summary>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
      >
        {actions.map((action, index) => (
          <li key={index}>
            <button onClick={action.onClick}>
              {action.icon}
              {action.label}
            </button>
          </li>
        ))}
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
