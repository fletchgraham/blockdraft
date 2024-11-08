"use client";
import { importUrls } from "../actions/blockController";
import { useActionState, useFormStatus } from "react-dom";

export default function ImportUrlsForm() {
  const { pending } = useFormStatus();

  return (
    <form action={importUrls} className="max-w-lg mx-auto">
      <textarea
        name="urls"
        className="textarea textarea-bordered w-full"
        placeholder="Paste URLs here"
      ></textarea>

      <div className="text-center">
        <button className="btn btn-primary mt-5">
          {pending ? "Submitting..." : "Import"}
        </button>
      </div>
    </form>
  );
}
