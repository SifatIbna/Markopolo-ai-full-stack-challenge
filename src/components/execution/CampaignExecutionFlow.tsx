'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Node,
  Edge,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CampaignRecommendation } from '@/types';
import { convertCampaignToFlow, FlowNode } from '@/lib/campaignFlowConverter';
import CustomNode from './CustomNode';
import ExecutionControls from './ExecutionControls';
import NodeDetailsPanel from './NodeDetailsPanel';
import NoSSR from '@/components/ui/NoSSR';

const nodeTypes = {
  default: CustomNode,
};

interface CampaignExecutionFlowProps {
  campaign: CampaignRecommendation;
}

const CampaignExecutionFlow: React.FC<CampaignExecutionFlowProps> = ({ campaign }) => {
  const { nodes: initialNodes, edges: initialEdges } = convertCampaignToFlow(campaign);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [executionSpeed, setExecutionSpeed] = useState(1);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as FlowNode);
  }, []);

  const executeNextStep = useCallback(async () => {
    if (currentStep >= initialNodes.length || !isExecuting) return;

    const currentNodeId = initialNodes[currentStep].id;
    const currentNode = initialNodes[currentStep] as FlowNode;

    // Mark current node as running
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentNodeId) {
          return {
            ...node,
            data: { ...node.data, status: 'running' }
          };
        }
        return node;
      })
    );

    // Animate the connecting edge
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === currentNodeId || edge.target === currentNodeId) {
          return {
            ...edge,
            animated: true,
            style: {
              ...edge.style,
              stroke: '#3b82f6',
              strokeWidth: 3
            }
          };
        }
        return edge;
      })
    );

    // Wait for the execution duration
    const duration = (currentNode.data.duration || 2000) / executionSpeed;
    await new Promise(resolve => setTimeout(resolve, duration));

    // Mark node as completed
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === currentNodeId) {
          return {
            ...node,
            data: { ...node.data, status: 'completed' }
          };
        }
        return node;
      })
    );

    // Stop edge animation
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === currentNodeId || edge.target === currentNodeId) {
          return {
            ...edge,
            animated: false,
            style: {
              ...edge.style,
              stroke: '#10b981',
              strokeWidth: 2
            }
          };
        }
        return edge;
      })
    );

    setCurrentStep(prev => prev + 1);
  }, [currentStep, initialNodes, isExecuting, executionSpeed, setNodes, setEdges]);

  const executeNextStepRef = useRef<(() => Promise<void>) | undefined>(undefined);
  executeNextStepRef.current = executeNextStep;

  useEffect(() => {
    if (isExecuting && currentStep < initialNodes.length) {
      executeNextStepRef.current?.();
    } else if (currentStep >= initialNodes.length && currentStep > 0) {
      setIsExecuting(false);
    }
  }, [currentStep, isExecuting, initialNodes.length]);

  const startExecution = () => {
    setIsExecuting(true);
    setCurrentStep(0);
    // Reset all nodes to pending
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, status: 'pending' }
      }))
    );
    // Reset all edges
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: false,
        style: {
          stroke: '#94a3b8',
          strokeWidth: 2,
          strokeDasharray: '5,5'
        }
      }))
    );
  };

  const pauseExecution = () => {
    setIsExecuting(false);
  };

  const resetExecution = () => {
    setIsExecuting(false);
    setCurrentStep(0);
    setNodes(initialNodes as Node[]);
    setEdges(initialEdges as Edge[]);
  };

  const progress = Math.round((currentStep / initialNodes.length) * 100);

  return (
    <div className="h-[70vh] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <NoSSR fallback={
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading workflow...</p>
          </div>
        </div>
      }>
        <ReactFlowProvider>
          <div className="flex h-full">
            <div className="flex-1 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                  padding: 0.2,
                  minZoom: 0.5,
                  maxZoom: 1.5
                }}
                minZoom={0.3}
                maxZoom={2}
                defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                attributionPosition="bottom-left"
                className="bg-gray-50 dark:bg-gray-900"
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#94a3b8"
                />
                <Controls
                  showZoom={true}
                  showFitView={true}
                  showInteractive={false}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </ReactFlow>

              <ExecutionControls
                isExecuting={isExecuting}
                progress={progress}
                onStart={startExecution}
                onPause={pauseExecution}
                onReset={resetExecution}
                executionSpeed={executionSpeed}
                onSpeedChange={setExecutionSpeed}
                className="absolute top-4 left-4"
              />
            </div>

            {selectedNode && (
              <NodeDetailsPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                className="w-80 border-l border-gray-200 dark:border-gray-700"
              />
            )}
          </div>
        </ReactFlowProvider>
      </NoSSR>
    </div>
  );
};

export default CampaignExecutionFlow;