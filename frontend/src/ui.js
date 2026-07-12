// ui.js — drag-and-drop pipeline canvas
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { InputNode }     from './nodes/inputNode';
import { LLMNode }       from './nodes/llmNode';
import { OutputNode }    from './nodes/outputNode';
import { TextNode }      from './nodes/textNode';
import { FilterNode }    from './nodes/filterNode';
import { MergeNode }     from './nodes/mergeNode';
import { TransformNode } from './nodes/transformNode';
import { ApiNode }       from './nodes/apiNode';
import { NoteNode }      from './nodes/noteNode';

import 'reactflow/dist/style.css';
import styles from './styles/Canvas.module.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  filter:       FilterNode,
  merge:        MergeNode,
  transform:    TransformNode,
  api:          ApiNode,
  note:         NoteNode,
};

/* Minimap colors mirror the toolbar palette */
const MINIMAP_COLORS = {
  customInput:  '#4a90d9',
  llm:          '#9b59b6',
  customOutput: '#e07b39',
  text:         '#27ae60',
  filter:       '#e74c3c',
  merge:        '#16a085',
  transform:    '#f39c12',
  api:          '#2980b9',
  note:         '#7f8c8d',
};

const selector = (state) => ({
  nodes:         state.nodes,
  edges:         state.edges,
  getNodeID:     state.getNodeID,
  addNode:       state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect:     state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        fitView
      >
        <Background color="#21262d" gap={gridSize} size={1.5} />
        <Controls />
        <MiniMap nodeColor={(n) => MINIMAP_COLORS[n.type] || '#4a90d9'} />
      </ReactFlow>

      {/* Empty-state hint — shown when no nodes are on the canvas yet */}
      {nodes.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyBorder} />
          <div className={styles.emptyIcon}>⊕</div>
          <div className={styles.emptyTitle}>Canvas is empty</div>
          <div className={styles.emptyBody}>
            Drag any node from the toolbar above to start building your pipeline
          </div>
        </div>
      )}
    </div>
  );
};
