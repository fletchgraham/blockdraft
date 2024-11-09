import BlockItem from "./BlockItem";

export default async function BlockList({ blocks }) {
  return (
    <ul>
      {blocks.map((block) => (
        <li key={block._id}>
          <BlockItem block={block} />
        </li>
      ))}
    </ul>
  );
}
