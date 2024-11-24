import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ImportUrlsForm from "../../components/ImportUrlsForm";

export default async function ImportUrlsPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
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
