
import { useState } from 'react';
import { BaseNode } from "../base/BaseNode";
import { LogOut } from "lucide-react";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const [format, setFormat] = useState(data?.format || 'JSON');
  const [showSetup, setShowSetup] = useState(false);

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setOutputType(e.target.value);
  const handleFormatChange = (e) => setFormat(e.target.value);

  // Type config (formats unchanged; colors adjusted for dark theme)
  const getTypeConfig = (type) => {
    const configs = {
      Text: { icon: '📄', color: 'text-emerald-300', ring: 'ring-emerald-400/30', formats: ['JSON', 'Plain Text', 'Markdown'] },
      File: { icon: '💾', color: 'text-blue-300', ring: 'ring-blue-400/30', formats: ['PDF', 'CSV', 'Excel', 'ZIP'] },
      Image: { icon: '🖼️', color: 'text-violet-300', ring: 'ring-violet-400/30', formats: ['PNG', 'JPEG', 'SVG', 'WebP'] },
      Data: { icon: '📊', color: 'text-amber-300', ring: 'ring-amber-400/30', formats: ['JSON', 'XML', 'CSV', 'YAML'] },
      Report: { icon: '📋', color: 'text-indigo-300', ring: 'ring-indigo-400/30', formats: ['PDF', 'HTML', 'Word', 'Excel'] }
    };
    return configs[type] || configs.Text;
  };

  const typeConfig = getTypeConfig(outputType);

  return (
    <BaseNode
      id={id}
      data={data}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">Output</div>
              <div className="text-slate-400 text-sm">Final output node</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium bg-slate-700 ring-1 ${typeConfig.ring} ${typeConfig.color}`}>
              <span className="mr-1">{typeConfig.icon}</span>
              {outputType}
            </span>
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-900 text-white rounded-lg transition-colors font-medium"
            >
              {showSetup ? 'Close' : 'Setup'}
            </button>
          </div>
        </div>
      }
      inputs={[{ id: 'value', position: 'center', label: 'Input' }]}
      width={400}
      height={showSetup ? 360 : 110}
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
      }}
    >
      {!showSetup && (
        <div className="px-4 pb-4 -mt-2">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-md bg-slate-700 text-cyan-300 font-mono">
                {currName}.{String(format).toLowerCase()}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{outputType}</span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{format}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Waiting</span>
            </div>
          </div>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4 mt-2 px-4 pb-4">
          {/* Output Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Output Name</label>
            <input
              type="text"
              value={currName}
              onChange={handleNameChange}
              placeholder="result_data"
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400 transition-all"
            />
          </div>

          {/* Output Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Output Type</label>
            <select
              value={outputType}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white transition-all"
            >
              <option value="Text">📄 Text</option>
              <option value="File">💾 File</option>
              <option value="Image">🖼️ Image</option>
              <option value="Data">📊 Data</option>
              <option value="Report">📋 Report</option>
            </select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Format</label>
            <select
              value={format}
              onChange={handleFormatChange}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white transition-all"
            >
              {typeConfig.formats.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Export Options</label>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-900 text-white rounded-lg transition-colors border border-slate-600">
                📥 Download
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-900 text-white rounded-lg transition-colors border border-slate-600">
                📤 Share
              </button>
            </div>
          </div>

          {/* Status + Preview */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Waiting</span>
            </div>
            <div
              className="text-sm text-cyan-400 font-mono truncate max-w-40"
              title={`${currName}.${String(format).toLowerCase()}`}
            >
              {currName}.{String(format).toLowerCase()}
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};
