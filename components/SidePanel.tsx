"use client";
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShieldAlert, Terminal, Copy, ChevronDown, RotateCcw } from 'lucide-react';
import { SidePanelCodeBlock } from '@/components/SidePanelCodeBlock'
import { SEVERITY_LEVELS } from '@/lib/constants'

interface Command {
    tool: string;
    label?: string;
    code: string;
    note?: string;
}

export default function SidePanel({
    node,
    onClose,
    onStatusChange
}: {
    node: any;
    onClose: () => void;
    onStatusChange: (nodeId: string, newStatus: string) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const isOpen = !!node;

    useEffect(() => {
        if (node?.data?.tools && node.data.tools.length > 0) {
            setSelectedTool(node.data.tools[0].name);
        } else {
            setSelectedTool(null);
        }
    }, [node]);

    // --- FONCTION DE PARSING DES RÉFÉRENCES ---
    const parseReferences = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\[\d+\])/g);
        const references = node?.data?.references || [];

        return (
            <>
                {parts.map((part, i) => {
                    const match = part.match(/\[(\d+)\]/);
                    if (match) {
                        const numStr = match[1];
                        const numInt = parseInt(numStr);

                        const refData = references.find((r: any) =>
                            r.id === numInt || r.id === numStr
                        );

                        if (refData?.url) {
                            return (
                                <a
                                    key={i}
                                    href={refData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    // 'title' affiche l'infobulle native du navigateur au survol
                                    title={refData.title || "Voir la source"}
                                    className="inline-flex items-center justify-center cursor-pointer pointer-events-auto text-primary font-bold mx-0.5 relative -top-1 text-[10px] min-w-[12px] min-h-[12px] z-[100] transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    [{numStr}]
                                </a>
                            );
                        }
                        return <sup key={i} className="text-primary/40">{numStr}</sup>;
                    }
                    return part;
                })}
            </>
        );
    };

    const renderTextWithBullets = (text: string, colorClass: string = "text-primary") => {
        if (!text) return null;

        return (
            <div className="space-y-2">
                {text.split('\n').map((line, idx) => {
                    const trimmedLine = line.trim();
                    const isBullet = trimmedLine.startsWith('-');

                    if (isBullet) {
                        return (
                            <div key={idx} className="flex gap-3 pl-2 leading-relaxed">
                                {/* La puce stylisée avec la couleur passée en paramètre */}
                                <span className={`${colorClass} font-bold shrink-0`}>•</span>
                                <span className="flex-1">
                                    {parseReferences(trimmedLine.substring(1).trim())}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <p key={idx} className="leading-relaxed">
                            {parseReferences(line)}
                        </p>
                    );
                })}
            </div>
        );
    };

    const allCommands: Command[] = node?.data?.commands || [];
    const availableTools: string[] = node?.data?.tools?.map((t: any) => t.name) || [];

    const renderSmartContent = () => {
        const blocks = node?.data?.contentBlocks || [];
        const visibleBlocks = blocks.filter((b: any) =>
            b.type === 'text' || b.type === 'proof' || b.type === 'remediation' || b.tool === selectedTool
        );

        if (visibleBlocks.length === 0 && !node?.data?.description) {
            return <p className="text-foreground/40 italic text-xs">Aucune documentation disponible.</p>;
        }

        return (
            <div className="flex flex-col space-y-5">
                {visibleBlocks.map((block: any, bIdx: number) => {

                    if (block.type === 'text') {
                        return (
                            <div key={bIdx} className="text-sm text-foreground font-light text-justify">
                                {renderTextWithBullets(block.content, "text-primary")}
                            </div>
                        );
                    }

                    if (block.type === 'tool-section') {
                        return (
                            <div key={bIdx} className="pt-2 animate-in fade-in duration-700">
                                {/* Header de section avec ligne horizontale */}
                                <div className="flex items-center gap-4 mt-5 mb-4">
                                    <h4 className="text-[13px] font-black text-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                                        Exploitation
                                    </h4>
                                    <div className="h-[1px] flex-1 bg-primary/30" />
                                </div>

                                {/* Description principale du bloc (supporte les puces) */}
                                {block.description && (
                                    <div className="text-sm text-foreground font-light mb-5 text-justify">
                                        {renderTextWithBullets(block.description, "text-primary")}
                                    </div>
                                )}

                                {/* Liste des étapes d'exploitation */}
                                <div className="space-y-6 mb-8">
                                    {block.steps.map((step: any, sIdx: number) => {
                                        const cmd = allCommands.find(
                                            (c) => c.tool === block.tool && c.label === step.label
                                        );

                                        return (
                                            <div key={sIdx} className="space-y-4">
                                                {/* Bloc de code interactif */}
                                                {cmd && <SidePanelCodeBlock cmd={cmd} />}

                                                {/* Texte explicatif après la commande (supporte les puces) */}
                                                {step.textAfter && (
                                                    <div className="text-sm text-foreground font-light text-justify">
                                                        {renderTextWithBullets(step.textAfter, "text-primary")}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }

                    // 2. BLOC PROOF
                    if (block.type === 'proof') {
                        return (
                            <div key={bIdx} className="pt-2 animate-in fade-in duration-700">
                                <div className="flex items-center gap-4 mt-5 mb-4">
                                    <h4 className="text-[13px] font-black text-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                                        Evidence
                                    </h4>
                                    <div className="h-[1px] flex-1 bg-primary/30" />
                                </div>

                                <div className="text-sm text-foreground font-light mb-5 text-justify">
                                    {renderTextWithBullets(block.content, "text-primary")}
                                </div>

                                {block.image && (
                                    <div className="mb-4">
                                        <img
                                            src={block.image}
                                            className="rounded-[0.5rem] border border-border/20 w-full object-cover shadow-sm hover:border-primary/40 transition-colors"
                                            alt="Proof"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // 3. BLOC REMEDIATION
                    if (block.type === 'remediation') {
                        return (
                            <div key={bIdx} className="pt-2 animate-in fade-in duration-700">
                                {/* Header Section */}
                                <div className="flex items-center gap-4 mt-5 mb-4">
                                    <h4 className="text-[13px] font-black text-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                                        Remediation
                                    </h4>
                                    <div className="h-[1px] flex-1 bg-primary/30" />
                                </div>

                                {/* Description principale */}
                                <div className="text-sm text-foreground font-light mb-5 text-justify">
                                    {renderTextWithBullets(block.content, "text-primary")}
                                </div>

                                {block.steps && (
                                    <div className="space-y-6 mb-8">
                                        {block.steps.map((step: any, sIdx: number) => {
                                            const cmd = allCommands.find(c => c.label === step.label);
                                            return (
                                                <div key={sIdx} className="space-y-4">
                                                    {cmd && <SidePanelCodeBlock cmd={cmd} />}
                                                    {step.textAfter && (
                                                        <div className="text-sm text-foreground font-light text-justify">
                                                            {renderTextWithBullets(step.textAfter, "text-blue-500")}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    const getTranslateX = () => {
        if (!isOpen) return 'translate-x-full';
        if (!isExpanded) return 'translate-x-[calc(100%-48px)]';
        return 'translate-x-0';
    };

    return (
        <div
            className={`fixed right-0 transition-transform duration-500 ease-in-out border-l border-border/30 ${getTranslateX()}`}
            style={{
                top: '64px',
                height: 'calc(100vh - 64px)',
                width: '450px',
                zIndex: 9999,
                backgroundColor: 'var(--card)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {isOpen && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 bg-card text-primary p-1.5 rounded-full border border-border/50 hover:scale-110 transition-all z-[1001] shadow-lg cursor-pointer"
                >
                    {isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            )}

            <div className="flex flex-col h-full w-full">
                {/* Header */}
                <div className="p-6 border-b border-border/10 bg-black/10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0 border border-primary/20">
                            <ShieldAlert className="text-primary" size={24} />
                        </div>
                        {isExpanded && (
                            <div className="min-w-0">
                                <h3 className="font-bold text-lg text-foreground truncate  uppercase tracking-tight pr-2">
                                    {node?.data?.title || node?.data?.label || "Unknown"}
                                </h3>
                                <p className="text-[10px] text-primary italic font-mono uppercase tracking-widest">
                                    {node?.parentNode
                                        ? `${node.parentNode}`
                                        :  "Analyse"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="space-y-12">
                            <section className="flex gap-4 items-start">
                                <div className="flex-1 flex flex-col min-h-[110px]">
                                    <h4 className="text-[10px] font-black text-foreground/60 uppercase tracking-[0.3em] mb-3">
                                        Exploitation tools
                                    </h4>
                                    <div className="relative w-full">
                                        <button
                                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                                            className="w-full h-10 flex items-center gap-3 bg-background/40 border border-border/20 rounded-[0.5rem] text-[11px] text-foreground hover:border-primary/40 transition-all group px-3 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center shrink-0 w-4 h-4">
                                                {selectedTool && (
                                                    <img
                                                        key={selectedTool}
                                                        src={node?.data?.tools?.find((t: any) => t.name === selectedTool)?.logo}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                                        alt=""
                                                        onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                )}
                                            </div>
                                            <span className="font-bold uppercase tracking-widest italic truncate">
                                                {selectedTool || "No tool selected"}
                                            </span>
                                            <ChevronDown size={12} className={`text-primary ml-auto transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isToolsOpen && (
                                            <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border/20 rounded-[0.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                                                {availableTools.map((t: string) => (
                                                    <button
                                                        key={t}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] text-foreground/70 hover:bg-primary/10 hover:text-foreground transition-colors border-b border-border/10 last:border-none text-left cursor-pointer"
                                                        onClick={() => { setSelectedTool(t); setIsToolsOpen(false); }}
                                                    >
                                                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                            <img
                                                                src={node?.data?.tools?.find((tool: any) => tool.name === t)?.logo}
                                                                className="w-full h-full object-contain"
                                                                alt=""
                                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                                            />
                                                        </div>
                                                        <span className="font-bold uppercase tracking-widest italic truncate">{t}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* SECTION CRITICITÉ */}
                                    <div className="mt-4 flex flex-col gap-2">
                                        <h4 className="text-[10px] font-black text-foreground/60 uppercase tracking-[0.3em] flex items-baseline gap-1">
                                            Severity
                                            <span className="text-[10px] font-light lowercase tracking-normal text-foreground/40 italic">
                                                (to be weighted)
                                            </span>
                                        </h4>

                                        {(() => {
                                            const severityKey = node?.data?.severity?.toLowerCase() || 'informational';
                                            const config = SEVERITY_LEVELS[severityKey] || SEVERITY_LEVELS.informational;
                                            const levels = Object.keys(SEVERITY_LEVELS);
                                            const currentIdx = levels.indexOf(severityKey);

                                            return (
                                                <div className={`flex items-center gap-3 px-3 py-2 rounded-[0.5rem] border border-border/20 ${config.bg} w-full transition-all duration-300`}>
                                                    {/* Le Point */}
                                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.3)]`} />

                                                    {/* Le Texte */}
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${config.text}`}>
                                                        {config.label}
                                                    </span>

                                                    {/* La Jauge (Barres) */}
                                                    <div className="ml-auto flex gap-1">
                                                        {/* On enlève le premier niveau (informational) pour n'avoir que 4 barres */}
                                                        {levels.slice(1).map((lvl, idx) => (
                                                            <div
                                                                key={lvl}
                                                                className={`w-3 h-1 rounded-full transition-all duration-500 ${
                                                                    // On ajoute 1 à l'index du slice pour comparer au currentIdx global
                                                                    (idx + 1) <= currentIdx ? config.bar : 'bg-white/10'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="w-32 shrink-0">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-[10px] font-black text-foreground/60 uppercase tracking-[0.3em]">Status</h4>
                                        <button onClick={() => onStatusChange(node.id, '')} className="text-foreground/40 hover:text-primary transition-colors cursor-pointer"><RotateCcw size={12} /></button>
                                    </div>
                                    <div className="relative flex flex-col bg-background/40 p-1 rounded-lg border border-border/10 gap-1 overflow-hidden">
                                        {['not-tested', 'unexploitable', 'exploited'].includes(node?.data?.status) && (
                                            <div className={`absolute left-1 right-1 h-8 rounded transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${node?.data?.status === 'not-tested' ? 'translate-y-0 bg-amber-500/20 border border-amber-500/30' : node?.data?.status === 'unexploitable' ? 'translate-y-[36px] bg-red-500/20 border border-red-500/30' : 'translate-y-[72px] bg-emerald-500/20 border border-emerald-500/30'}`} />
                                        )}
                                        {[{ id: 'not-tested', label: 'Not Tested', hover: 'hover:text-amber-500' }, { id: 'unexploitable', label: 'Unexploitable', hover: 'hover:text-red-500' }, { id: 'exploited', label: 'Exploited', hover: 'hover:text-emerald-500' }].map((s) => (
                                            <button key={s.id} onClick={() => onStatusChange(node.id, s.id)} className={`relative z-10 h-8 flex items-center justify-center text-[9px] font-bold uppercase rounded transition-colors duration-300 cursor-pointer ${node?.data?.status === s.id ? 'text-foreground' : `text-foreground/30 ${s.hover}`}`}>{s.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mt-5 mb-4">
                                    <h4 className="text-[13px] font-black text-foreground uppercase tracking-[0.3em] whitespace-nowrap">Theory</h4>
                                    <div className="h-[1px] flex-1 bg-primary/30" />
                                </div>
                                {renderSmartContent()}
                            </section>
                        </div>
                    </div>
                )}

                {isExpanded && (
                    <div className="p-6 mt-auto border-t border-border/10 bg-black/20">
                        <button onClick={onClose} className="w-full py-3 bg-foreground/5 hover:bg-primary/20 text-foreground/60 hover:text-foreground border border-border/10 hover:border-primary/50 rounded-lg text-[11px] font-bold transition-all uppercase tracking-widest cursor-pointer">Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}