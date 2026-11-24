import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublications, Publication } from "@/lib/publications";

export default async function FeaturedPublications() {
  const publications: Publication[] = await getPublications();

  return (
    /* - py-0 : On supprime les marges verticales pour coller aux sections voisines.
       - px-4 : On garde un petit padding de sécurité uniquement pour le mobile.
    */
    <section className="w-full overflow-hidden py-10 pt-8">
      
      {/* - my-12 : C'est cette marge qui crée l'espace au dessus/dessous du bloc.
          - max-w-7xl : Ton bloc garde sa taille élégante.
      */}
      
      <div className="max-w-7xl mx-auto relative rounded-[1.5rem] bg-hero-left overflow-hidden p-8 md:p-12
    before:absolute before:inset-0 before:rounded-[1.5rem] before:border-[2px] before:border-primary
    before:[mask-image:linear-gradient(to_top,black_20%,transparent_95%)] before:pointer-events-none">
    
    <div className="relative z-10">
      {/* Titre */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold font-title-2 mb-2">Recent Publications</h2>
        <div className="h-1 w-12 bg-primary mx-auto lg:mx-0" />
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publications.map((pub, index) => (
          <motion.div
            key={pub.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
                <Card className="overflow-hidden py-0 cursor-pointer font-title-2 rounded-[1rem] hover:shadow-xl transition-all duration-300 border border-border/50 bg-card/50 backdrop-blur-md">
                  {pub.cover && (
                    <CardHeader className="p-4 pb-0">
                      <div className="relative h-60 w-full overflow-hidden rounded-lg">
                        <img
                          src={pub.cover}
                          alt={pub.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </CardHeader>
                  )}
                  <CardContent className="px-6 pt-4">
                    <Badge variant="secondary" className="mb-2 bg-green-500/10 text-foreground border-none font-sans rounded-[0.5rem]">
                      Publication
                    </Badge>
                    <CardTitle className="mb-2 text-xl">{pub.title}</CardTitle>
                    <CardDescription className="text-muted-foreground font-sans line-clamp-3">
                      {pub.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex items-center gap-3 p-6 pt-0">
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground text-xs font-mono">
                        {new Date(pub.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}