import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeProps,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface ConceptMapProps {
  nodes: Node[];
  edges: Edge[];
}

function ConceptNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200">
      <div className="font-bold">{data.label}</div>
    </div>
  );
}

const nodeTypes = {
  concept: ConceptNode,
};

export function ConceptMap({ nodes, edges }: ConceptMapProps) {
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node, nodes: Node[]) => {
      console.log('node drag stop', node, nodes);
    },
    []
  );

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}