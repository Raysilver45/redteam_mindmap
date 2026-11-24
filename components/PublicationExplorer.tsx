"use client";

import { useState } from "react";
import { Publication } from "@/lib/publications";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Props {
  publications: Publication[];
}

export default function PublicationExplorer({ publications }: Props) {
  const [viewByCategory, setViewByCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Groupement par catégorie (basé sur le champ 'category' de ton frontmatter)
  const categories = publications.reduce((acc, pub) => {
    const cat = pub.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pub);
    return acc;
  }, {} as Record<string, Publication[]>);

  const categoryList = Object.keys(categories);

  return (
    <div className="space-y-12">
      {/* SECTION HEADER & SWITCH */}
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-title-2 font-bold text-foreground mb-4">
            {viewByCategory ? "Browse by Category" : "All publications"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {viewByCategory 
              ? "Explore our research organized by technical domains." 
              : "Articles, notes and research from Arcadia Labs."}
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-card/30 p-2 rounded-full border backdrop-blur-sm">
          <Label htmlFor="view-mode" className={`cursor-pointer transition-colors ${!viewByCategory ? "text-primary font-bold" : "text-muted-foreground"}`}>
            Feed
          </Label>
          <Switch
            id="view-mode"
            checked={viewByCategory}
            onCheckedChange={(val) => {
                setViewByCategory(val);
                setSelectedCategory(null);
            }}
          />
          <Label htmlFor="view-mode" className={`cursor-pointer transition-colors ${viewByCategory ? "text-primary font-bold" : "text-muted-foreground"}`}>
            Categories
          </Label>
        </div>
      </div>

      {/* CONTENU DYNAMIQUE */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {!viewByCategory ? (
            /* --- VUE : TOUTES LES PUBLICATIONS (GRID 2 COL) --- */
            <motion.div
              key="all-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {publications.map((pub, index) => (
                <PublicationCard key={pub.slug} pub={pub} index={index} />
              ))}
            </motion.div>
          ) : (
            /* --- VUE : CATÉGORIES --- */
            <motion.div
              key="categories-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {!selectedCategory ? (
                /* Liste des tuiles de catégories */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryList.map((cat, index) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <Card className="group cursor-pointer h-40 flex items-center justify-center border-0 bg-card/40 hover:bg-card/60 transition-all rounded-[0.5rem]">
                        <CardContent className="p-0 text-center">
                          <h3 className="text-2xl font-bold font-title-2 group-hover:text-primary transition-colors">
                            {cat}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-2">
                            {categories[cat].length} article{categories[cat].length > 1 ? 's' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Liste des publications d'une catégorie spécifique */
                <div className="space-y-8">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Back to categories
                  </button>
                  <div className="grid md:grid-cols-2 gap-8">
                    {categories[selectedCategory].map((pub, index) => (
                      <PublicationCard key={pub.slug} pub={pub} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Composant de carte réutilisable respectant ton design
 */
function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/publications/${pub.slug}`}>
        <Card className="group cursor-pointer overflow-hidden py-0 hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-xs flex flex-col h-full rounded-[0.5rem]">
          
          {/* Header avec Image & Overlay */}
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={pub.coverUrl}
              alt={pub.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-title-2 font-bold text-white mb-2 leading-tight">
                {pub.title}
              </h3>
              <div className="text-sm text-white/70 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(pub.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Corps de la carte */}
          <CardContent className="px-6 py-6 flex flex-col flex-grow">
            <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow leading-relaxed">
              {pub.description}
            </p>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center text-primary font-bold group-hover:underline">
                Read more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </div>

              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-background/80 font-mono text-[10px] uppercase tracking-wider">
                  {pub.category || "General"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}