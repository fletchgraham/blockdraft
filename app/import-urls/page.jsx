import Header from "@/components/Header";
import ImportUrlsForm from "../../components/ImportUrlsForm";

export default async function ImportUrlsPage() {
  return (
    <>
      <Header title="Import" />
      <h2 className="text-center text-2xl font-bold mb-5 mt-10">
        Paste URLs below to import blocks.
      </h2>
      <ImportUrlsForm />
    </>
  );
}
