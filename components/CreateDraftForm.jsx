"use client";
import { createDraft } from "@/actions/drafts";
import { useActionState } from "react";

export default function CreateDraftForm() {
  const [state, formAction] = useActionState(createDraft, "");

  return (
    <form action={formAction} className="max-w-md mx-auto">
      <input
        type="text"
        name="draftName"
        placeholder="Draft Name"
        className="input input-bordered w-full"
      />

      <p className="text-red-500">{state.error}</p>

      <div className="text-center">
        <button className="btn btn-primary mt-5">Create Draft</button>
      </div>
    </form>
  );
}
