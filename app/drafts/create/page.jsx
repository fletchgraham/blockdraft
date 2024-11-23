import Header from "@/components/Header";
import CreateDraftForm from "../../../components/CreateDraftForm";

export default async function CreateDraftPage() {
  return (
    <>
      <Header title="Create Draft" />
      <h2 className="text-center text-2xl font-bold mt-10 mb-5">
        Name your draft.
      </h2>
      <CreateDraftForm />
    </>
  );
}
