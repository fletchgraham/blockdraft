"use client";
import { createDraft } from "@/actions/drafts";
import { useActionState, useState } from "react";
import { getTodayFormatted, getTomorrowFormatted } from "@/lib/dateUtils";

export default function CreateDraftForm() {
  const [state, formAction] = useActionState(createDraft, "");
  const [draftName, setDraftName] = useState("");

  const setToday = () => {
    setDraftName(getTodayFormatted());
  };

  const setTomorrow = () => {
    setDraftName(getTomorrowFormatted());
  };

  return (
    <form action={formAction} className="max-w-md mx-auto">
      <input
        type="text"
        name="draftName"
        placeholder="Draft Name"
        className="input input-bordered w-full"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
      />

      <div className="flex gap-2 mt-3 mb-3">
        <button
          type="button"
          className="btn btn-outline btn-sm flex-1"
          onClick={setToday}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm flex-1"
          onClick={setTomorrow}
        >
          Tomorrow
        </button>
      </div>

      <p className="text-red-500">{state.error}</p>

      <div className="text-center">
        <button className="btn btn-primary mt-5">Create Draft</button>
      </div>
    </form>
  );
}
