import { getBlocks } from "../actions/blockController";
import BlockItem from "./BlockItem";

export default async function BlockList() {
  const blocks = await getBlocks();
  return (
    <>
      {/* if no blocks, show a message */}
      {blocks.length === 0 && (
        <p className="text-center text-2xl font-bold">
          You don't have any blocks yet! Import some urls to get started.
        </p>
      )}

      {blocks.length > 0 && (
        <ul>
          {blocks.map((block) => (
            <li key={block._id}>
              <BlockItem block={block} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
