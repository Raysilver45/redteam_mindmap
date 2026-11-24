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


import FlowsintNode from '@/components/ui/mindmap_nodes';
import { dataAD } from '@/lib/mindmap_data';
import { dataAS400 } from '@/lib/mindmap_as400';
import { dataRedTeam } from '@/lib/mindmap_redteam';


const nodeTypes = {
  flowsintNode: FlowsintNode,
};

const MAP_DATA: Record<string, { nodes: Node[], edges: Edge[] }> = {
  AD: dataAD,
  AS400: dataAS400,
  REDTEAM: dataRedTeam
};

export default function Labs() {
  return (
<div>
<p>Work in progress</p>

</div>

  );
}