import { getPublications } from "@/lib/publications";
import PublicationExplorer from "@/components/PublicationExplorer";

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <PublicationExplorer publications={publications} />
    </main>
  );
}