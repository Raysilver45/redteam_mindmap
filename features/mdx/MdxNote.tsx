import { Alert } from "@/components/ui/alert";
import { Notebook } from "lucide-react";
import { ReactNode } from "react";

export type MdxNoteProps = {
  children: ReactNode;
};

export const MdxNote = (props: MdxNoteProps) => {
  return (
    <Alert className="border-primary bg-primary/10 dark:border-[oklch(33.659%_0.15818_312.818)] dark:bg-purple-500/10 mt-2 mb-2 rounded-[0.5rem]">
      <Notebook size={12} />
      <div className="mdx-content">{props.children}</div>
    </Alert>
  );
};