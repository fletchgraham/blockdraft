export default function GeneratedArticle({ blocks }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="space-y-8">
        {blocks.map((block) => (
          <div key={block._id.toString()}>
            {block.content && (
              <h2 className="text-2xl font-semibold mb-4">{block.content}</h2>
            )}
            {block.thumbnailUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={block.thumbnailUrl}
                  alt="Block thumbnail"
                  className="max-w-full w-48 h-auto rounded shadow"
                />
              </div>
            )}
            <p className="font-bold text-lg mb-2">
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {block.title}
              </a>
            </p>
            {block.summary && <p className="text-gray-700">{block.summary}</p>}
            {block.type !== "custom" && <hr className="my-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
