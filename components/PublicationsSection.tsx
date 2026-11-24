import { getPublications } from "@/lib/publications";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default async function PublicationsSection() {
  const publications = await getPublications();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-title-2 font-bold text-foreground mb-4">
            All publications
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-title-2">
            Articles, notes and research from Arcadia Labs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
  {publications.map((post, index) => (
    <motion.div
      key={post.slug}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/publications/${post.slug}`}>
        <Card className="group cursor-pointer overflow-hidden py-0 hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-xs flex flex-col">
          
          {/* Image avec overlay pour texte */}
          {post.coverUrl && (
            <div className="relative w-full h-56">
              <img
                src={post.coverUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                <h3 className="text-xl font-title-2 font-bold text-white">
                  {post.title}
                </h3>
                <div className="text-sm text-white/80 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {post.publishedAt instanceof Date
                    ? post.publishedAt.toLocaleDateString()
                    : new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          <CardContent className="px-6 py-4 flex flex-col flex-grow">
            {/* Description */}
            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
              {post.description}
            </p>

            {/* Read More + Badges */}
            <div className="flex justify-between items-center">
              <div className="flex items-center text-primary font-medium group-hover:underline">
                Read more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>

              <div className="flex space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-background/80 backdrop-blur-xs"
                >
                  Publication
                </Badge>
              </div>
            </div>
          </CardContent>

        </Card>
      </Link>
    </motion.div>
  ))}
</div>

      </div>
    </section>
  );
}
