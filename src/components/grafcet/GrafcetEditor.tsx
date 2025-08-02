import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { GrafcetToolbar } from './GrafcetToolbar';
import { GrafcetPalette } from './GrafcetPalette';
import { StepNode } from './nodes/StepNode';
import { InitialStepNode } from './nodes/InitialStepNode';
import { ActionNode } from './nodes/ActionNode';
import { TransitionNode } from './nodes/TransitionNode';
import { GrafcetEdge } from './edges/GrafcetEdge';
import { HorizontalEdge } from './edges/HorizontalEdge';
import { toast } from 'sonner';

const nodeTypes = {
  step: StepNode,
  initialStep: InitialStepNode,
  action: ActionNode,
  transition: TransitionNode,
};

const edgeTypes = {
  grafcet: GrafcetEdge,
  horizontal: HorizontalEdge,
};

const STEP_WIDTH = 48;
const STEP_HEIGHT = 48;

interface GrafcetData {
  nodes: Node[];
  edges: Edge[];
  version: string;
  metadata: {
    name: string;
    created: string;
    modified: string;
  };
}

export const GrafcetEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [snapGrid, setSnapGrid] = useState(20);
  const [stepCounter, setStepCounter] = useState(1);
  const [transitionCounter, setTransitionCounter] = useState(1);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  const snapToGrid = useMemo(() => [snapGrid, snapGrid] as [number, number], [snapGrid]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Determine edge type based on source and target positions
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      let edgeType = 'grafcet';
      const animated = false;
      
      // If connecting to action, force horizontal connection from right handle
      if (targetNode?.type === 'action') {
        edgeType = 'horizontal';
        // Override source handle to ensure right connection
        params.sourceHandle = 'right';
      }

      const edge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: edgeType,
        animated,
        style: { stroke: 'hsl(var(--grafcet-connection))' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges, nodes]
  );

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    //if (event.key === 'Delete' || event.key === 'Backspace') {
	if (event.key === 'Delete') {
      setNodes((nds) => nds.filter((node) => !node.selected));
      setEdges((eds) => eds.filter((edge) => !edge.selected));
    }
    
    if (event.key === 'Control') {
      setIsCtrlPressed(true);
    }
  }, [setNodes, setEdges]);

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Control') {
      setIsCtrlPressed(false);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const wrapper = reactFlowWrapper.current;
      if (!wrapper) {
        toast.error('Zone de dépôt introuvable');
        return;
      }

      if (typeof reactFlowInstance.screenToFlowPosition !== 'function') {
        toast.error("La conversion de coordonnées est indisponible");
        return;
      }

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }
	  
	  const nodeDimensions: Record<string, { width: number; height: number }> = {
        step: { width: 48, height: 48 },
        initialStep: { width: 48, height: 48 },
        action: { width: 96, height: 48 },
      };

      const widthStr = event.dataTransfer.getData('application/reactflow/width');
      const heightStr = event.dataTransfer.getData('application/reactflow/height');

      const defaultSize = nodeDimensions[type] || { width: 0, height: 0 };
      const parsedWidth = widthStr ? parseFloat(widthStr) : NaN;
      const parsedHeight = heightStr ? parseFloat(heightStr) : NaN;

      const elementWidth = !isNaN(parsedWidth)
        ? parsedWidth
        : defaultSize.width;
      const elementHeight = !isNaN(parsedHeight)
        ? parsedHeight
        : defaultSize.height;

      // Check if trying to add multiple initial steps
      if (type === 'initialStep') {
        const hasInitialStep = nodes.some(node => node.type === 'initialStep');
        if (hasInitialStep) {
          toast.error('Une seule étape initiale est autorisée dans un GRAFCET');
          return;
        }
      }

      /*const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });*/
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });	  
	  
      // Calculate raw position centered on the node
      const rawX = position.x - elementWidth / 2;
      const rawY = position.y - elementHeight / 2;

      // Snap position to grid
      const snappedX = Math.round(rawX / snapGrid) * snapGrid;
      const snappedY = Math.round(rawY / snapGrid) * snapGrid;	        

      // Apply position directly 
      const snappedPosition = {
        x: snappedX,
        y: snappedY,
      };

      let nodeData: Record<string, unknown> = {};
      let nodeId = '';

      if (type === 'step' || type === 'initialStep') {
        nodeId = `step-${stepCounter}`;
        nodeData = { number: stepCounter, label: `Étape ${stepCounter}` };
        setStepCounter(prev => prev + 1);
      } else if (type === 'action') {
        nodeId = `action-${Date.now()}`;
        nodeData = { text: 'Action' };
      }

      const newNode: Node = {
        id: nodeId,
        type,
        position: snappedPosition,
        data: nodeData,
        dragHandle: '.drag-handle',
      };

      setNodes((nds) => nds.concat(newNode));
      toast.success(`${type === 'initialStep' ? 'Étape initiale' : type === 'step' ? 'Étape' : 'Action'} ajoutée`);
    },
    [nodes, stepCounter, setNodes, reactFlowInstance, snapGrid]
  );

  const saveGrafcet = useCallback(() => {
    const grafcetData: GrafcetData = {
      nodes,
      edges,
      version: '1.0',
      metadata: {
        name: 'GRAFCET',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
    };

    const dataStr = JSON.stringify(grafcetData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grafcet.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('GRAFCET sauvegardé avec succès');
  }, [nodes, edges]);

  const loadGrafcet = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const grafcetData: GrafcetData = JSON.parse(e.target?.result as string);
        setNodes(grafcetData.nodes);
        setEdges(grafcetData.edges);
        
        // Update step counter to avoid conflicts
        const maxStepNumber = grafcetData.nodes
          .filter(node => node.type === 'step' || node.type === 'initialStep')
          .reduce(
            (max, node) =>
              Math.max(
                max,
                (node.data as { number?: number })?.number || 0
              ),
            0
          );
        setStepCounter(maxStepNumber + 1);
		
        reactFlowInstance.fitView();
        
        toast.success('GRAFCET chargé avec succès');
      } catch (error) {
        toast.error('Erreur lors du chargement du fichier');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, [setNodes, setEdges, reactFlowInstance]);

  const exportImage = useCallback(async () => {
    const { default: html2canvas } = await import('html2canvas');
    
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowElement) return;

    try {
      const canvas = await html2canvas(reactFlowElement, {
        backgroundColor: 'white',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'grafcet.png';
      link.href = canvas.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image exportée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export de l\'image');
    }
  }, []);

  
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (isCtrlPressed) {
      event.stopPropagation();
      
      // Only allow transitions on grafcet edges between steps
      if (edge.type !== 'grafcet') return;
      
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      if (!['step', 'initialStep'].includes(sourceNode.type || '') || 
          !['step', 'initialStep'].includes(targetNode.type || '')) return;
      
      // Calculate position at the middle of the edge
      const sourceX = sourceNode.position.x + STEP_WIDTH / 2; // center of step
      const sourceY = sourceNode.position.y + STEP_HEIGHT; // bottom of step
      const targetX = targetNode.position.x + STEP_WIDTH / 2; // center of step
      const targetY = targetNode.position.y; // top of step
      
      const transitionX = (sourceX + targetX) / 2 - 12; // center minus half transition width
      const transitionY = (sourceY + targetY) / 2 - 8; // center minus half transition height
      
      // Create transition node without handles
      const transitionNode: Node = {
        id: `transition-${transitionCounter}`,
        type: 'transition',
        position: { x: transitionX, y: transitionY },
        data: { condition: '' },
        dragHandle: '.drag-handle',
        selectable: true,
        draggable: true,
      };
      
      // Add transition node without modifying existing edges
      setNodes((nds) => [...nds, transitionNode]);
      setTransitionCounter(prev => prev + 1);
      
      toast.success('Transition créée');
    }
  }, [isCtrlPressed, nodes, transitionCounter, setNodes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => onKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) => onKeyUp(event);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <GrafcetToolbar
        onSave={saveGrafcet}
        onLoad={loadGrafcet}
        onExportImage={exportImage}
        snapGrid={snapGrid}
        onSnapGridChange={setSnapGrid}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <GrafcetPalette />
        
        <div className="flex-1 bg-canvas-bg" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid={true}
            snapGrid={snapToGrid}
            connectionMode={ConnectionMode.Loose}

            attributionPosition="bottom-left"
            style={{ backgroundColor: 'hsl(var(--canvas-bg))' }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={snapGrid}
              size={1}
              color="hsl(var(--grafcet-grid))"
            />
            <Controls />
            <MiniMap
              nodeStrokeColor="hsl(var(--grafcet-connection))"
              nodeColor="hsl(var(--grafcet-step))"
              nodeBorderRadius={2}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
