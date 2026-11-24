import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { z } from "zod";
import { serialize } from "next-mdx-remote/serialize";
import { rehypePlugin } from "@/features/mdx/mdx-plugin";

const publicationsDirectory = path.join(process.cwd(), "content");

// Schéma avec cover
const PublicationSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string(),
  cover: z.string().optional(),
  publishedAt: z.coerce.date(),
  published: z.boolean().optional().default(false),
  category: z.string().default("Uncategorized"),
});

export type Publication = z.infer<typeof PublicationSchema> & {
  slug: string;
  content: string;
  source: any;
  coverUrl?: string; // chemin prêt à l'affichage
};

export const getPublications = async (): Promise<Publication[]> => {
  const files = await fs.readdir(publicationsDirectory);
  const fileNames = files.filter((f) => f.endsWith(".mdx"));

  const publications: Publication[] = [];

  for await (const fileName of fileNames) {
    const fullPath = path.join(publicationsDirectory, fileName);
    const fileContent = await fs.readFile(fullPath, "utf-8");
    const frontmatter = matter(fileContent);

    const safeData = PublicationSchema.safeParse(frontmatter.data);

    if (!safeData.success) {
      console.error(`Error parsing file: ${fileName}`);
      safeData.error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(" -> ")}: ${issue.message}`);
      });
      continue;
    }

    if (!safeData.data.published && process.env.NODE_ENV !== "development") {
      continue;
    }

    let mdxSource: any = null;
    try {
      mdxSource = await serialize(frontmatter.content, {
        mdxOptions: { rehypePlugins: rehypePlugin },
      });
    } catch (err: any) {
      console.error(`Failed to serialize ${fileName}:`, err?.message || err);
      continue;
    }

    const slug = fileName.replace(/^\d+-/, "").replace(".mdx", "");

    // Construire le chemin public pour la cover si défini
    const coverUrl = safeData.data.cover
      ? `/${safeData.data.cover}`
      : "/image.png"; // fallback global

    publications.push({
      ...safeData.data,
      slug,
      content: frontmatter.content,
      source: mdxSource,
      coverUrl,
    });
  }

  return publications;
};

export const getPublication = async (slug: string): Promise<Publication | undefined> => {
  const publications = await getPublications();
  return publications.find((pub) => pub.slug === slug);
};
