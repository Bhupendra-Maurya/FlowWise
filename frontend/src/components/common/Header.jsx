import { useState } from "react";
import { SubmitButton } from "../SubmitButton";

export const Header = ({
  nodes = [],
  edges = [],
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const [pipelineName, setPipelineName] = useState("Untitled Pipeline");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 shadow-lg">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-cyan-400 
                       font-medium text-sm rounded-lg transition-all duration-300
                       hover:bg-slate-800 border border-slate-600 hover:border-cyan-400"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              className="text-lg font-semibold bg-transparent border-b-2 border-cyan-400 
                       text-white focus:outline-none placeholder-slate-400"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold text-white cursor-pointer hover:text-cyan-400 
                       transition-colors duration-300"
              onClick={() => setIsEditing(true)}
            >
              {pipelineName}
            </h1>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-6 text-sm text-slate-400">
          {/* <button className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Suggest
          </button> */}
          <button className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Import
          </button>
          <button className="hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Export
          </button>
        </div>

        <SubmitButton nodes={nodes} edges={edges} />
      </div>
    </header>
  );
};
