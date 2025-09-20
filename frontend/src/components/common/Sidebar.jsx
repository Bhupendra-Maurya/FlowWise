
import { useState } from "react";
import {
  Mail,
  LogIn,
  LogOut,
  FileText,
  Bot,
  Globe,
  Database,
  FolderOpen,
  GitBranch,
  Code,
  Zap,
  Calculator,
  Github,
  MessageSquare,
  Bug

} from "lucide-react";

const nodeCategories = [
  {
    title: "Core Nodes",
    nodes: [
      {
        type: "customInput",
        label: "Input",
        icon: LogIn,
        description: "Data input node",
      },
      {
        type: "customOutput",
        label: "Output",
        icon: LogOut,
        description: "Data output node",
      },
      {
        type: "text",
        label: "Text",
        icon: FileText,
        description: "Text processing",
      },
      {
        type: "llm",
        label: "LLM",
        icon: Bot,
        description: "Language model",
      },
    ],
  },
  {
    title: "Integrations",
    nodes: [
      {
        type: "apiRequest",
        label: "API Request",
        icon: Globe,
        description: "HTTP fetch",
      },
      {
        type: "database",
        label: "Database",
        icon: Database,
        description: "Query/Store",
      },
      {
        type: "file",
        label: "File",
        icon: FolderOpen,
        description: "Upload/Download",
      },
    ],
  },
  {
    title: "Logic",
    nodes: [
      {
        type: "condition",
        label: "Condition",
        icon: GitBranch,
        description: "If/Else",
      },
      {
        type: "function",
        label: "Function",
        icon: Code,
        description: "Custom JS",
      },
    ],
  },
];

export const Sidebar = ({ collapsed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(["Actions", "Core Nodes"]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredCategories = nodeCategories
    .map((category) => ({
      ...category,
      nodes: category.nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.nodes.length > 0);

  return (
    <div
      className={`bg-slate-900 border-r border-slate-700 shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${collapsed ? "w-16" : "w-80"
        } lg:relative absolute lg:translate-x-0 ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        } h-full z-10`}
    >
      {/* Sidebar Header */}
      <div className={`p-4 border-b border-slate-700 transition-opacity duration-300 ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!collapsed && (
          <div className="transition-all duration-300">
            <h2 className="text-lg font-semibold text-white mb-3">Nodes</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-lg 
                         focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400 transition-all duration-300"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 overflow-hidden">
        {collapsed ? (
          // Collapsed view - just icons
          <div className="space-y-3 transition-all duration-300">
            {nodeCategories
              .flatMap((category) => category.nodes)
              .slice(0, 6) // Limit icons in collapsed view
              .map((node, index) => {
                const IconComponent = node.icon;
                return (
                  <div key={`${node.type}-${index}`} className="flex justify-center">
                    <div className="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 
                                 hover:border-cyan-400 rounded-lg flex items-center justify-center 
                                 cursor-pointer transition-all duration-300 group"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData(
                          "application/reactflow",
                          JSON.stringify({ nodeType: node.type })
                        );
                      }}>
                      <IconComponent className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // Expanded view - full categories
          <div className={`space-y-6 transition-all duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            {filteredCategories.map((category) => (
              <div key={category.title}>
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full flex items-center justify-between p-3 text-left font-medium 
                           text-white hover:bg-slate-800 rounded-lg transition-all duration-300 
                           border border-transparent hover:border-slate-600"
                >
                  <span className="text-sm font-semibold tracking-wide">{category.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 text-slate-400 ${expandedCategories.includes(category.title)
                        ? "rotate-90"
                        : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {expandedCategories.includes(category.title) && (
                  <div className="mt-3 space-y-2 pl-2">
                    {category.nodes.map((node) => {
                      const IconComponent = node.icon;
                      return (
                        <div
                          key={node.type}
                          className="flex items-center p-3 bg-slate-800 hover:bg-slate-700 
                                   border border-slate-600 hover:border-cyan-400 rounded-lg 
                                   cursor-pointer transition-all duration-300 group"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData(
                              "application/reactflow",
                              JSON.stringify({ nodeType: node.type })
                            );
                          }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-600 
                                        rounded-lg flex items-center justify-center mr-3 
                                        group-hover:from-cyan-500 group-hover:to-blue-500 
                                        transition-all duration-300">
                            <IconComponent className="w-5 h-5 text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium group-hover:text-cyan-400 
                                         transition-colors duration-300">
                              {node.label}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};