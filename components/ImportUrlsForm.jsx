"use client";
import { importUrls } from "../actions/blockController";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function ImportUrlsForm() {
  const [state, formAction] = useActionState(importUrls, "");

  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="max-w-lg mx-auto">
      <textarea
        name="urls"
        className="textarea textarea-bordered w-full"
        placeholder="Paste URLs here"
      ></textarea>

      <p className="text-red-500">{state}</p>

      <div className="text-center">
        <button className="btn btn-primary mt-5">
          {pending ? "Submitting..." : "Import"}
        </button>
      </div>
    </form>
  );
}
