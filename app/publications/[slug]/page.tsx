import { Mdx } from "@/features/mdx/Mdx";
import { getPublication } from "@/lib/publications";
import { generateToc, TocItem } from "@/lib/tableofcontents";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TableOfContents } from "@/components/TableOfContents";
import GitTimeline from "@/components/GitTimeline";

export const dynamic = "force-static";

export const generateMetadata = async (props: {
  params: { slug: string } | Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const publication = await getPublication(params.slug);

  if (!publication) {
    return {
      title: "404 - Page Not Found",
      description: "Page not found",
    };
  }

  return {
    title: publication.title,
    description: publication.description,
  };
};

export default async function RoutePage(props: { params: { slug: string } | Promise<{ slug: string }> }) {
  const params = await props.params;
  const publication = await getPublication(params.slug);

  if (!publication) {
    notFound();
  }

  const toc: TocItem[] = generateToc(publication.content);

  return (
  <div className="relative px-4 py-10">
    <div 
      className="
        grid 
        grid-cols-1 
        lg:grid-cols-[1fr_minmax(0,4xl)_1fr] 
        gap-6
      "
    >

      {/* Left column — GitTimeline */}
      <div className="hidden xl:flex justify-end pr-6">
        <GitTimeline />
      </div>

      {/* Publication content (unchanged width) */}
      <div className="max-w-4xl mx-auto min-w-0">
        <header className="mb-6">
          <h1 className="mt-2 text-5xl tracking-tight font-publication-title mb-3">
            {publication.title}
          </h1>
          <p className="italic text-sm">
            Written by <span className="text-primary">the-protag0nist</span> –{" "}
            <time>
              {publication.publishedAt instanceof Date
                ? publication.publishedAt.toLocaleDateString()
                : new Date(publication.publishedAt).toLocaleDateString()}
            </time>
          </p>
        </header>

        <div className="p-4 border bg-border-tldr text-sm text-foreground bg-[--border-tldr] dark:bg-transparent dark:border-border-tldr">
          Ici ton texte de TL;DR…
        </div>

        <section className="mt-15 prose prose-sm lg:prose-lg">
          <Mdx>{publication.content}</Mdx>
        </section>
      </div>

      {/* Right column — TOC */}
      <div className="hidden lg:flex justify-start pl-6">
        <TableOfContents items={toc} />
      </div>

    </div>
  </div>
);

}