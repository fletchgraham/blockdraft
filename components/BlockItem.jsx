export default function BlockItem({ block }) {
  return (
    <div className="flex items-center p-4 bg-base-100 shadow rounded-lg mb-2 relative">
      {/* Thumbnail */}
      {block.thumbnailUrl && (
        <img
          src={block.thumbnailUrl}
          alt="Thumbnail"
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
      )}

      {/* Content */}
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

      {/* Dropdown menu */}
      <details className="dropdown ml-auto">
        <summary className="cursor-pointer p-2 rounded-full">
          {/* &#x22EE; Unicode character for vertical ellipsis (three dots) */}
        </summary>
        <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </details>
    </div>
  );
}
