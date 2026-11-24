"use client";

import { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { createHighlighter } from "shiki";

interface SidePanelCodeBlockProps {
    cmd: {
        label?: string;
        code: string;
    };
}

export const SidePanelCodeBlock = ({ cmd }: SidePanelCodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const highlight = async () => {
            const highlighter = await createHighlighter({
                themes: ["github-dark-high-contrast"],
                langs: ["bash", "sh", "powershell"],
            });

            if (codeRef.current) {
                const html = highlighter.codeToHtml(cmd.code, {
                    lang: "bash",
                    theme: "github-dark-high-contrast",
                });
                codeRef.current.innerHTML = html;

                // Nettoyage du style par défaut de Shiki pour matcher ton UI
                const pre = codeRef.current.querySelector('pre');
                if (pre) {
                    pre.style.backgroundColor = 'transparent';
                    pre.style.padding = '0';
                }
            }
        };
        highlight();
    }, [cmd.code]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(cmd.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-background/40 border border-border/20 rounded-[0.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-300 shadow-sm">
            <div className="flex justify-between items-center bg-black/20 px-3 py-1.5 border-b border-border/10">
                <span className="text-[10px] font-bold text-foreground/50 flex items-center gap-2 uppercase tracking-wider">
                    <Terminal size={10} className="text-primary" /> 
                    {cmd.label || "Command"}
                </span>
                <button
                    onClick={handleCopy}
                    className="text-foreground/40 hover:text-primary transition-colors p-1"
                >
                    {copied ? (
                        <Check size={12} className="text-emerald-500" />
                    ) : (
                        <Copy size={12} />
                    )}
                </button>
            </div>
            <div 
                ref={codeRef}
                className="p-4 block text-[11px] font-mono break-all leading-tight tracking-tight overflow-x-auto custom-scrollbar"
            />
        </div>
    );
};