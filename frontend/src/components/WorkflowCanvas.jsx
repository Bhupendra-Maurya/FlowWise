import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import ReactFlow, { Background } from "reactflow";
import { useStore } from "../store/Store.js";

// Core Nodes
import { InputNode } from "../nodes/core/InputNode.jsx";
import { LLMNode } from "../nodes/core/LLMNode.jsx";
import { OutputNode } from "../nodes/core/OutputNode.jsx";
import { TextNode } from "../nodes/core/TextNode.jsx";

// New Nodes
import { APIRequestNode } from "../nodes/new/APIRequestNode.jsx";
import { ConditionNode } from "../nodes/new/ConditionNode.jsx";
import { DatabaseNode } from "../nodes/new/DatabaseNode.jsx";
import { FileNode } from "../nodes/new/FileNode.jsx";
import { FunctionNode } from "../nodes/new/FunctionNode.jsx";
import { DeleteButton } from "../utility/DeleteButton.jsx";

import "reactflow/dist/style.css";

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,

  condition: ConditionNode,
  apiRequest: APIRequestNode,
  database: DatabaseNode,
  function: FunctionNode,
  file: FileNode,
};
const gridSize = 20;
const proOptions = { hideAttribution: true };

export const WorkflowCanvas = ({ onPipelineChange }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const deleteSelectedNodes = useStore((state) => state.deleteSelectedNodes);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

  // Notify parent component when pipeline changes (for SubmitButton)
  useEffect(() => {
    if (onPipelineChange) {
      onPipelineChange(nodes, edges);
    }
  }, [nodes, edges, onPipelineChange]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only listen for Delete key, not Backspace
      if (event.key === "Delete") {
        // Only delete if we're not typing in an input field
        const activeElement = document.activeElement;
        const isTyping =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "SELECT" ||
            activeElement.isContentEditable);

        // Don't delete nodes if user is typing
        if (!isTyping) {
          event.preventDefault();
          deleteSelectedNodes();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedNodes]);

  const getInitNodeData = useCallback((nodeID, type) => {
    return { id: nodeID, nodeType: type };
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode, getInitNodeData]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const reactFlowProps = useMemo(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onDrop,
      onDragOver,
      nodeTypes,
      proOptions,
      snapGrid: [gridSize, gridSize],
      connectionLineType: "smoothstep",
      fitView: true,
      deleteKeyCode: null,
    }),
    [nodes, edges, onNodesChange, onEdgesChange, onConnect, onDrop, onDragOver]
  );

  const hasSelectedNodes = nodes.some((node) => node.selected);
  const hasSelectedEdges = edges.some((edge) => edge.selected);

  const deleteSelectedEdges = useCallback(() => {
    if (!reactFlowInstance) return;
    const selectedEdges = edges.filter((e) => e.selected);
    if (selectedEdges.length === 0) return;
    reactFlowInstance.deleteElements({ edges: selectedEdges });
  }, [reactFlowInstance, edges]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Delete") return;

      // Don't delete if user is typing
      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          activeElement.isContentEditable);

      if (isTyping) return;

      // Prefer deleting selected edges first
      if (edges.some((e) => e.selected)) {
        event.preventDefault();
        deleteSelectedEdges();
        return;
      }

      // Fallback: delete selected nodes (existing behavior)
      if (nodes.some((n) => n.selected)) {
        event.preventDefault();
        deleteSelectedNodes();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [edges, nodes, deleteSelectedNodes, deleteSelectedEdges]);

  return (
    <div className="flex-1 relative bg-slate-800">
      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          className="w-12 h-12 bg-slate-700 hover:bg-slate-600 border border-slate-600 
                   hover:border-cyan-400 rounded-lg flex items-center justify-center 
                   text-white hover:text-cyan-400 transition-all duration-300 shadow-lg"
          onClick={() => reactFlowInstance?.fitView()}
          title="Fit View"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        <button
          className="w-12 h-12 bg-slate-700 hover:bg-slate-600 border border-slate-600 
                   hover:border-cyan-400 rounded-lg flex items-center justify-center 
                   text-white hover:text-cyan-400 transition-all duration-300 shadow-lg"
          onClick={() => reactFlowInstance?.setCenter(0, 0)}
          title="Center"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </button>

        {hasSelectedNodes && (
          <DeleteButton
            onClick={deleteSelectedNodes}
            title="Delete Selected Node(s)"
          />
        )}

        {hasSelectedEdges && (
          <DeleteButton
            onClick={deleteSelectedEdges}
            title="Delete Selected Edge(s)"
          />
        )}
      </div>

      {/* React Flow Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 h-full">
        <ReactFlow
          {...reactFlowProps}
          onInit={setReactFlowInstance}
          className="bg-slate-800"
        >
          <Background
            color="#475569"
            gap={gridSize}
            size={1}
            variant="dots"
            className="opacity-40"
          />
        </ReactFlow>
      </div>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-600 
                          rounded-full flex items-center justify-center border-2 border-slate-600"
            >
              <svg
                className="w-10 h-10 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Start building your pipeline
            </h3>
            <p className="text-slate-400 max-w-sm text-lg">
              Drag nodes from the sidebar to get started. Connect them to create
              your workflow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
