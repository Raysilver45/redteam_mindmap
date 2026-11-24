"use client";

import { Switch } from "@/components/ui/switch";
import { LayoutGrid, List } from "lucide-react"; // Optionnel, pour le style

export function ViewToggle({ isCategoryView, onToggle }: { isCategoryView: boolean, onToggle: (val: boolean) => void }) {
  return (
    <div className="flex items-center space-x-3 bg-muted/50 p-2 rounded-full border">
      <List className={`h-4 w-4 ${!isCategoryView ? "text-primary" : "text-muted-foreground"}`} />
      <Switch 
        checked={isCategoryView} 
        onCheckedChange={onToggle} 
      />
      <LayoutGrid className={`h-4 w-4 ${isCategoryView ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-sm font-medium pr-2">
        {isCategoryView ? "Par Catégories" : "Flux Récent"}
      </span>
    </div>
  );
}