import { importUrls } from "../actions/blockController";

export default async function ImportUrlsForm() {
  return (
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
  );
}
