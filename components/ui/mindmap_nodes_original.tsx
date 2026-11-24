import React from 'react';
import { Handle, Position } from 'reactflow';
import {
    CheckCircle2,
    XCircle,
    CircleOff,
    ShieldUser,
} from 'lucide-react';

export default function FlowsintNode({ data }: any) {
    const sourceColor = data.sourceColor || '#334155';
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
        <div className={`bg-[#1a1b1e] text-slate-300 rounded-md border border-slate-800 shadow-xl overflow-hidden relative transition-all duration-300
      ${hasDescription
                ? 'p-4 w-[280px]'
                : `py-1.5 px-3 w-auto min-w-[160px] flex items-center`
            } 
    `}>
            {/* Barres latérales */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: sourceColor }} />
            {targetColor && (
                <div className="absolute right-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: targetColor, boxShadow: `-2px 0 10px ${targetColor}33` }} />
            )}

            {/* --- CONTENU --- */}
            {/* On applique le dynamicPadding ici */}
            <div className={`flex ${hasDescription ? 'flex-col' : `flex-row items-center ${dynamicPadding}`}`}>
                <h3 className={`
            text-white font-bold uppercase tracking-tight italic whitespace-nowrap pr-4
            ${hasDescription ? 'text-[13px]' : 'text-[10px]'}
            `}>
                    {data.title || data.label}
                </h3>

                {hasDescription && (
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1 mb-3 text-justify">
                        {data.description}
                    </p>
                )}

                <div className={`flex gap-1 ${hasDescription ? 'mt-1' : 'translate-y-[0.5px]'}`}>
                    {data.labels?.map((label: string, i: number) => (
                        <span key={i} className="bg-slate-800/30 border border-slate-700/50 px-1.5 py-[0.5px] rounded text-[8px] text-slate-500 uppercase font-black tracking-tighter">
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* --- ZONE DES ICÔNES (DROITE) --- */}
            <div className={`absolute z-20 flex items-center gap-2 ${hasDescription ? 'top-2.5 right-2.5' : 'right-2.5 top-1/2 -translate-y-1/2'}`}>
                
                {/* On utilise showShield ici aussi */}
                {showShield && (
                    <ShieldUser
                        size={14}
                        className={`${getAuthStyle()} transition-all duration-500 -translate-y-[1px]`}
                        strokeWidth={2.5}
                    />
                )}

                <div className="flex items-center">
                    {data.status === 'exploited' && <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500/10" />}
                    {data.status === 'unexploitable' && <XCircle size={14} className="text-red-500 fill-red-500/10 opacity-70" />}
                    {data.status === 'not-tested' && <CircleOff size={14} className="text-amber-500 fill-amber-500/10" />}
                </div>
            </div>

            <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-600 border-none hover:!bg-blue-400 transition-colors" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 border-none transition-colors" style={{ backgroundColor: targetColor || sourceColor }} />
        </div>
    );
}