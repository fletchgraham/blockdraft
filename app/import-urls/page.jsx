import ImportUrlsForm from "../../components/ImportUrlsForm";

export default async function ImportUrlsPage() {
  return (
    <>
      <h2 className="text-center text-2xl font-bold mb-5">
        Paste URLs below to import blocks.
      </h2>
      <ImportUrlsForm />
    </>
  );
}
