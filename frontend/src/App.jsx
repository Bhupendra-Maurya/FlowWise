
import { useState } from "react";
import { ReactFlowProvider } from 'reactflow';
import { Header } from "./components/common/Header";
import { Sidebar } from "./components/common/Sidebar";
import { WorkflowCanvas } from "./components/WorkflowCanvas";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentNodes, setCurrentNodes] = useState([]);
  const [currentEdges, setCurrentEdges] = useState([]);

  const handlePipelineChange = (nodes, edges) => {
    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen bg-slate-800 flex flex-col overflow-hidden font-['Inter',sans-serif]">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          nodes={currentNodes}
          edges={currentEdges}
        />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar collapsed={sidebarCollapsed} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <WorkflowCanvas onPipelineChange={handlePipelineChange} />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;