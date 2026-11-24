"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { createHighlighter } from "shiki";

type CommandProps = {
  tool?: string;
  children?: React.ReactNode;
};

// 1. IL MANQUAIT CET EXPORT NOMMÉ ICI
export const Command: React.FC<CommandProps> = ({ tool = "cmd", children }) => {
  return (
    <div data-mdx-command-tool={tool} style={{ display: "none" }}>
      {children}
    </div>
  );
};

export const CommandGroup: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const items = React.Children.toArray(children).map((child) => {
    const props = (child as any).props || {};
    const tool = props.tool || "cmd";
    
    const extractMDXText = (node: any): string => {
      if (!node) return "";
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(extractMDXText).join("");
      if (node.props?.children) return extractMDXText(node.props.children);
      if (typeof node === "object" && node.type === "code") return node.props.children;
      return "";
    };

    let code = extractMDXText(props.children)
      .replace(/```[a-z]*\n?/g, "")
      .replace(/```/g, "")
      .trim();

    return { tool, code };
  });

  const [value, setValue] = useState(items.length > 0 ? items[0].tool : "");
  const [copied, setCopied] = useState(false);
  const current = items.find((i) => i.tool === value) || items[0];
  const codeRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!items.length) return;

    const highlight = async () => {
      const highlighter = await createHighlighter({
        themes: ["github-dark-high-contrast"],
        langs: ["bash", "sh", "powershell"],
      });

      items.forEach((it) => {
        const el = codeRefs.current[it.tool];
        if (el) {
          el.innerHTML = highlighter.codeToHtml(it.code, {
            lang: "bash",
            theme: "github-dark-high-contrast",
          });
          
          const preElement = el.querySelector('pre');
          if (preElement) {
              preElement.style.backgroundColor = 'transparent';
              preElement.style.padding = '0';
          }
        }
      });
    };

    highlight();
  }, [items, value]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!items.length) return null;

  return (
    <div className="dark w-full my-6">
<div className="bg-[#0b0f16] text-foreground rounded-[0.5rem] overflow-hidden border border-zinc-800 shadow-xl">        <Tabs value={value} onValueChange={setValue} className="w-full">
          <div className="flex items-center gap-2 bg-black/20 border-b border-white/5 px-3 h-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 7l5 5l-5 5" />
                  <path d="M12 19h7" />
               </svg>

            <TabsList className="bg-transparent h-auto p-0 gap-1">
              {items.map((it) => (
                <TabsTrigger
                  key={it.tool}
                  value={it.tool}
                  className="data-[state=active]:!bg-white/10 data-[state=active]:text-white text-zinc-500 px-3 py-1 text-[11px] font-bold tracking-wider transition-all rounded-[0.5rem]"
                >
                  {it.tool}
                </TabsTrigger>
              ))}
            </TabsList>

            <button
              onClick={handleCopy}
              className="ml-auto p-2 text-zinc-500 hover:text-primary transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="relative group">
            {items.map((it) => (
              <TabsContent 
                key={it.tool} 
                value={it.tool} 
                className="mt-0 focus-visible:outline-none"
              >
                <div 
                  ref={(el) => { codeRefs.current[it.tool] = el; }}
                  className="p-4 font-mono text-sm overflow-x-auto min-h-[50px]"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// 2. EXPORT PAR DÉFAUT POUR COMMANDGROUP
export default CommandGroup;