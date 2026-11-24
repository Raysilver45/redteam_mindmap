import React from 'react';
import { Handle, Position } from 'reactflow';
import {
    CheckCircle2,
    XCircle,
    CircleOff,
    ShieldUser,
} from 'lucide-react';

export default function FlowsintNode({ data }: any) {
    const sourceColor = data.sourceColor || 'var(--primary)';
    const targetColor = data.targetColor;
    const hasDescription = data.description && data.description.trim() !== "";

    // 1. On définit si le Shield doit être affiché
    const showShield = data.authenticated === 'True' || data.authenticated === 'Possible' || data.authenticated === 'Admin';

    // 2. Gestion dynamique du padding à droite pour les nodes sans description
    // pr-12 si shield + status, pr-7 si status uniquement
    const dynamicPadding = showShield ? 'pr-12' : 'pr-7';

    const getAuthStyle = () => {
        if (data.authenticated === 'Admin') return "text-red-500";
        if (data.authenticated === 'True') return "text-amber-500";
        if (data.authenticated === 'Possible') return "text-yellow-200";
        return "";
    };

    return (
        <div className={`
            bg-node-background text-foreground rounded-[0.3rem] border border-border shadow-xl overflow-hidden relative transition-all duration-300
            ${hasDescription ? 'p-4 w-[280px]' : `py-2 px-3 w-auto min-w-[160px] flex items-center`} 
        `}>
            {/* Barre latérale gauche dynamique (source) */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: sourceColor }} />
            
            {/* Barre latérale droite optionnelle (target) */}
            {targetColor && (
                <div className="absolute right-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: targetColor, boxShadow: `-2px 0 10px ${targetColor}33` }} />
            )}

            {/* --- CONTENU --- */}
            <div className={`flex ${hasDescription ? 'flex-col' : `flex-row items-center ${dynamicPadding}`}`}>
                <h3 className={`
                    text-foreground font-headline font-bold uppercase tracking-tight italic whitespace-nowrap pr-4
                    ${hasDescription ? 'text-[13px] mb-1' : 'text-[10px]'}
                `}>
                    {data.title || data.label}
                </h3>

                {hasDescription && (
                    <p className="text-[11px] text-foreground/60 font-body leading-relaxed mt-1 mb-3 text-justify">
                        {data.description}
                    </p>
                )}

                <div className={`flex gap-1.5 ${hasDescription ? 'mt-2' : 'translate-y-[0.5px]'}`}>
    {data.labels?.map((label: string, i: number) => (
        <span 
            key={i} 
            className="bg-primary/5 border border-primary/20 px-2 py-[1px] rounded-[2px] text-[8px] text-primary/90 uppercase font-bold tracking-[0.1em] shadow-[inset_0_0_4px_rgba(143,53,18,0.1)]"
        >
            {label}
        </span>
    ))}
</div>
            </div>

            {/* --- ZONE DES ICÔNES (DROITE) --- */}
            <div className={`absolute z-20 flex items-center gap-2 ${hasDescription ? 'top-3 right-3' : 'right-3 top-1/2 -translate-y-1/2'}`}>
                
                {showShield && (
                    <ShieldUser
                        size={14}
                        className={`${getAuthStyle()} transition-all duration-500`}
                        strokeWidth={2.5}
                    />
                )}

                <div className="flex items-center">
                    {/* On utilise des couleurs sémantiques basées sur OKLCH pour plus de cohérence */}
                    {data.status === 'exploited' && <CheckCircle2 size={14} className="text-emerald-500 opacity-90" />}
                    {data.status === 'unexploitable' && <XCircle size={14} className="text-red-500 opacity-70" />}
                    {data.status === 'not-tested' && <CircleOff size={14} className="text-foreground/20" />}
                </div>
            </div>

            {/* Handles de ReactFlow : Utilisation de ton Bleu et de tes Bordures */}
            <Handle 
                type="target" 
                position={Position.Left} 
                className="w-2 h-2 !bg-accent border-none hover:!scale-125 transition-transform" 
            />
            <Handle 
                type="source" 
                position={Position.Right} 
                className="w-2 h-2 border-none transition-transform hover:!scale-125" 
                style={{ backgroundColor: targetColor || sourceColor }} 
            />
        </div>
    );
}