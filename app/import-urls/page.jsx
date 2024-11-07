import { importUrls } from "../../actions/blockController";

export default async function ImportUrlsPage() {
  return (
    <>
      <h2 className="text-center text-2xl font-bold mt-10 mb-5">
        Paste URLs below to import blocks.
      </h2>
      <form action={importUrls} className="max-w-lg mx-auto">
        <textarea
          name="urls"
          className="textarea textarea-bordered w-full"
          placeholder="Paste URLs here"
        ></textarea>

        <div className="text-center">
          <button className="btn btn-primary mt-5">Import</button>
        </div>
      </form>
    </>
  );
}
