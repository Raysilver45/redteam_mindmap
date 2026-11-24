"use client";

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { toSvg } from 'html-to-image';
import { getNodesBounds } from 'reactflow';

import FlowsintNode from '@/components/ui/mindmap_nodes';
import { dataAD } from '@/lib/mindmap_data';
import { dataAS400 } from '@/lib/mindmap_as400';
import { dataRedTeam } from '@/lib/mindmap_redteam';

import SlidingTabs from '@/components/SlidingTabs';
import SidePanel from '@/components/SidePanel';
import MindmapControls from '@/components/ui/mindmap_controls';

const nodeTypes = {
  flowsintNode: FlowsintNode,
};

const MAP_DATA: Record<string, { nodes: Node[], edges: Edge[] }> = {
  AD: dataAD,
  AS400: dataAS400,
  REDTEAM: dataRedTeam
};

export default function Mindmap() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('AD');
  const [isExporting, setIsExporting] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(dataAD.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    dataAD.edges.map(edge => ({
      ...edge,
      focusable: false,
      interactionWidth: 0, // Désactive la zone de détection
      style: { ...edge.style, opacity: 0 }
    }))
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleSwitchMap = (id: string) => {
    setActiveTab(id);
    setSelectedNode(null);
    setNodes(MAP_DATA[id].nodes);
    setEdges(MAP_DATA[id].edges.map(e => ({
      ...e,
      focusable: false,
      interactionWidth: 0, // Désactive la zone de détection
      style: { ...e.style, opacity: 0 }
    })));
  };

  const onNodeClick = useCallback(
    (_: React.MouseEvent, clickedNode: Node) => {
      setSelectedNode(clickedNode);
      const nodeId = clickedNode.id;

      const getAncestors = (id: string, allEdges: Edge[], depth = 1): Record<string, number> => {
        let map: Record<string, number> = {};
        allEdges.filter(e => e.target === id).forEach(e => {
          map[e.source] = depth;
          map = { ...map, ...getAncestors(e.source, allEdges, depth + 1) };
        });
        return map;
      };

      const ancestorsMap = getAncestors(nodeId, edges);
      const targetNodeIds = edges.filter(e => e.source === nodeId).map(e => e.target);

      const clickX = clickedNode.positionAbsolute?.x ?? clickedNode.position.x;
      const clickY = clickedNode.positionAbsolute?.y ?? clickedNode.position.y;

      setNodes((nds: Node[]) => {
        const directParents = Object.entries(ancestorsMap)
          .filter(([_, depth]) => depth === 1)
          .sort((a, b) => {
            const nodeA = nds.find(n => n.id === a[0]);
            const nodeB = nds.find(n => n.id === b[0]);
            return (nodeA?.position.y ?? 0) - (nodeB?.position.y ?? 0);
          });

        const numParents = directParents.length;
        const slotHeight = 150;
        const totalStackHeight = (numParents - 1) * slotHeight;
        const startY = clickY - totalStackHeight / 2;

        let currentChildYOffset = 0;

        return nds.map((node: Node) => {
          const isClicked = node.id === nodeId;
          const isTarget = targetNodeIds.includes(node.id);
          const ancestorDepth = ancestorsMap[node.id];

          const commonData = {
            ...node.data,
            originalParent: node.parentNode || node.data.originalParent,
            originalPos: node.data.originalPos || { ...node.position }
          };

          if (isTarget) {
            const hasDesc = node.data.description && node.data.description.trim() !== "";
            const targetY = clickY + currentChildYOffset;
            currentChildYOffset += hasDesc ? 160 : 70;
            return {
              ...node,
              data: commonData,
              parentNode: undefined,
              position: { x: clickX + 450, y: targetY },
              style: { ...node.style, opacity: 1, zIndex: 1000, boxShadow: 'none', transition: 'all 0.5s ease-out' },
            };
          }

          if (ancestorDepth) {
            const targetX = clickX - (450 * ancestorDepth);
            let targetY = node.position.y;

            if (ancestorDepth === 1) {
              const parentIndex = directParents.findIndex(p => p[0] === node.id);
              targetY = startY + (parentIndex * slotHeight);
            } else {
              const edgeToChild = edges.find(e => e.source === node.id && ancestorsMap[e.target] === 1);
              if (edgeToChild) {
                const parentIndex = directParents.findIndex(p => p[0] === edgeToChild.target);
                targetY = startY + (parentIndex * slotHeight);
              }
            }

            return {
              ...node,
              data: commonData,
              parentNode: undefined,
              position: { x: targetX, y: targetY },
              style: { ...node.style, opacity: 1, zIndex: 10, boxShadow: 'none', transition: 'all 0.5s ease-out' }
            };
          }

          if (isClicked) {
            return {
              ...node,
              style: {
                ...node.style,
                opacity: 1,
                zIndex: 10,
                // Utilise ta couleur primary (orange/corail) pour le glow
                boxShadow: '0 0 30px var(--edge-background)'
              }
            };
          }

          const resetStyle = { ...node.style, opacity: 0.05, zIndex: 1, boxShadow: 'none' };
          if (node.data?.originalPos) {
            return {
              ...node,
              parentNode: node.data.originalParent,
              position: node.data.originalPos,
              data: { ...node.data, originalPos: undefined, originalParent: undefined },
              style: { ...resetStyle, transition: 'all 0.5s ease-in-out' },
            };
          }
          return { ...node, style: resetStyle };
        });
      });

      const activeIds = [nodeId, ...Object.keys(ancestorsMap), ...targetNodeIds];
      setEdges((eds: Edge[]) =>
        eds.map((edge: Edge) => {
          const isActive = activeIds.includes(edge.source) && activeIds.includes(edge.target);
          return {
            ...edge,
            animated: isActive,
            focusable: false,
            interactionWidth: 0, // On force à 0 même si actif
            style: {
              stroke: isActive ? 'var(--edge-background)' : 'var(--border)',
              strokeWidth: isActive ? 3 : 1,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            },
          };
        })
      );
    },
    [setEdges, setNodes, edges]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setNodes((nds: Node[]) =>
      nds.map((node) => {
        if (node.data && node.data.originalPos) {
          return {
            ...node,
            parentNode: node.data.originalParent,
            position: node.data.originalPos,
            data: { ...node.data, originalPos: undefined, originalParent: undefined },
            style: { ...node.style, opacity: 1, zIndex: 1, boxShadow: 'none', transition: 'all 0.5s ease-in-out' },
          };
        }
        return { ...node, style: { ...node.style, opacity: 1, boxShadow: 'none' } };
      })
    );

    setEdges((eds: Edge[]) =>
      eds.map((edge) => ({
        ...edge,
        animated: false,
        style: {
          stroke: 'var(--muted-foreground)',
          strokeWidth: 1,
          opacity: 0,
          strokeDasharray: 'none'
        },
      }))
    );
  }, [setNodes, setEdges]);

  const updateNodeStatus = useCallback((nodeId: string, newStatus: string) => {
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => {
        if (node.id === nodeId) return { ...node, data: { ...node.data, status: newStatus } };
        return node;
      })
    );
    setSelectedNode((prev: Node | null) =>
      prev?.id === nodeId ? { ...prev, data: { ...prev.data, status: newStatus } } : prev
    );
  }, [setNodes]);

  const exportSvg = useCallback(() => {
    setIsExporting(true);
    setTimeout(() => {
      const nodesBounds = getNodesBounds(nodes);
      const element = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!element || nodes.length === 0) { setIsExporting(false); return; }

      const padding = 200;
      const width = nodesBounds.width + (padding * 2);
      const height = nodesBounds.height + (padding * 2);

      toSvg(element, {
        // RÉCUPÉRATION DYNAMIQUE DU BACKGROUND DU THÈME
        backgroundColor: getComputedStyle(document.body).getPropertyValue('--background'),
        fontEmbedCSS: '',
        width: width,
        height: height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${-nodesBounds.x + padding}px, ${-nodesBounds.y + padding}px) scale(1)`,
        },
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `attack-path-${activeTab}.svg`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => console.error(err))
        .finally(() => setIsExporting(false));
    }, 50);
  }, [nodes, activeTab]);

  return (
    // UTILISATION DE LA VARIABLE --background
    <div style={{ width: '100%', height: '95vh', backgroundColor: 'var(--background)', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        key={activeTab}
        minZoom={0.01}
        maxZoom={1.5}
        onlyRenderVisibleElements={!isExporting}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >

        <Panel position="bottom-left" style={{ marginLeft: '170px', marginBottom: '20px' }}>
          <button
            onClick={exportSvg}
            disabled={isExporting}
            // Utilisation des classes sémantiques : bg-card, border-border, text-primary
            className={`flex items-center gap-2.5 p-2.5 border rounded-[0.3rem]  transition-all duration-300 shadow-xl backdrop-blur-sm ${isExporting
                ? 'bg-muted border-border cursor-not-allowed opacity-50'
                : 'bg-card border-border hover:border-primary/50 text-muted-foreground'
              }`}
          >
            <div className="flex items-center justify-center text-primary">
              {isExporting ? (
                <div className="w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </div>
            <span className={`text-[11px] font-bold tracking-wide whitespace-nowrap px-1 ${isExporting ? 'text-muted-foreground' : 'text-foreground'
              }`}>
              {isExporting ? 'GÉNÉRATION...' : 'EXPORT SVG'}
            </span>
          </button>
        </Panel>

        {/* BACKGROUND DYNAMIQUE */}
        <Background
          color="#4A4840" // Couleur plus claire que #32302A pour augmenter le contraste
          variant="dots"
          gap={40}        // Garde l'espacement large style Arcadia
          size={2}        // Augmente la taille de 1 à 2 pour qu'ils survivent au dézoom
          style={{ backgroundColor: '#1A1816' }}
        />

        <MindmapControls />

        <MiniMap
          nodeColor="var(--primary)"
          maskColor="var(--map-overlay)"
          position="bottom-left"
          className="!m-4 !mb-20"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            width: 150,
            height: 100,
          }}
        />

        <Panel position="top-center">
          <SlidingTabs
            tabs={['AD', 'AS400']}
            activeTab={activeTab}
            onChange={handleSwitchMap}
          />
        </Panel>

        <Panel position="top-left">
          <div className="relative">
            {/* 1. L'ICÔNE RÉDUITE (Visible seulement quand fermé) */}
            {!isOpen && (
              <button
                onClick={() => setIsOpen(true)}
                className="w-10 h-10 bg-card/90 border border-border shadow-xl backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 hover:border-primary/50 transition-all duration-300 cursor-pointer animate-in zoom-in"
              >
                <span className="text-lg">ℹ️</span>
              </button>
            )}

            {/* 2. LE PANNEAU ÉTENDU (Avec animation d'entrée propre) */}
            {isOpen && (
              <div
                className="w-80 bg-card/95 border border-border shadow-2xl backdrop-blur-md rounded-xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300"
              >
                {/* Header cliquable pour fermer */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full p-4 border-b border-border/50 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">Information</span>
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">✕</span>
                </button>

                {/* Contenu */}
                <div className="p-4 text-sm text-muted-foreground leading-relaxed">
  <div className="space-y-6">
    
    {/* SECTION : AUDIT SCOPE */}
    <div className="space-y-3">
      <h5 className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">
        What for ?
      </h5>
      <p className="text-[13px] font-light leading-snug">
        Interactive mindmaps are designed to give comprehensive and detailed insights into exploiting each path within internal environments. <br></br><br></br>They can be used to:
      </p>
      <div className="space-y-2">
        {[
          "Review attack vectors to be considered and evaluated during an assessment;",
          "Track the progression of tested attack scenarios;",
          "Understand how an attack vector can be exploited;",
          "Identify remediation strategies for vulnerabilities and configuration flaws."
        ].map((text, i) => (
          <div key={i} className="flex gap-3 pl-1">
            <span className="text-primary font-bold shrink-0 text-[10px] mt-0.5">•</span>
            <span className="text-[12px] font-light leading-snug">{text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* SECTION : INTERACTION*/}
    <div className="space-y-3">
      <h5 className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">
        Interactivity
      </h5>
      <p className="text-[13px] font-light leading-snug">
Select any node to access technical insights and explore various exploitation methodologies using different security tools. <br></br>Node statuses are adjustable to provide a clear visual overview of the current path exploitability and track findings.</p>
    </div>

    {/* SECTION : EXPORT */}
    <div className="space-y-3">
      <h5 className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">
        Export
      </h5>
      <p className="text-[13px] font-light leading-snug">
        The complete map or a selected path can be exported as high-quality SVG files at any time.
      </p>
    </div>

    {/* WARNING BOX */}
    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
      <p className="text-[11px] leading-relaxed text-orange-200/80">
        <span className="font-bold text-orange-500 uppercase mr-1">Warning:</span>
        This tool is 100% client-side. Refreshing or navigating away will reset your current progress.
      </p>
    </div>

    <div className="space-y-3">
  <p className="text-[9px] font-light leading-snug italic">
    Inspired by{" "}
    <a 
      className="text-primary underline hover:text-primary/80 transition-colors" 
      href="https://orange-cyberdefense.github.io/ocd-mindmaps/img/mindmap_ad_dark_classic_2025.03.excalidraw.svg"
      target="_blank"
      rel="noopener noreferrer"
    >
      OrangeCyberdéfense's
    </a>{" "}
    original work &{" "}
    <a 
      className="text-primary underline hover:text-primary/80 transition-colors" 
      href="https://www.flowsint.io/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Flowsint
    </a>{" "}
    design.
  </p>
</div>

  </div>
</div>
              </div>
            )}
          </div>
        </Panel>

        <SidePanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onStatusChange={updateNodeStatus}
        />
      </ReactFlow>
    </div>
  );
}