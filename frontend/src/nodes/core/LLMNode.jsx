
import { useState } from 'react';
import { BaseNode } from "../base/BaseNode";
import { Brain } from "lucide-react";

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [temperature, setTemperature] = useState(
    typeof data?.temperature === "number" ? data.temperature : 0.7
  );
  const [maxTokens, setMaxTokens] = useState(
    typeof data?.maxTokens === "number" ? data.maxTokens : 1000
  );
  const [prompt, setPrompt] = useState(data?.prompt || "");
  const [showSetup, setShowSetup] = useState(false);

  return (
    <BaseNode
      id={id}
      data={data}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">LLM</div>
              <div className="text-slate-400 text-sm">Large language model</div>
            </div>
          </div>
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-900 text-white rounded-lg transition-colors font-medium"
          >
            {showSetup ? "Close" : "Setup"}
          </button>
        </div>
      }
      inputs={[
        { id: 'system', position: 'top-third', label: 'System' },
        { id: 'prompt', position: 'bottom-third', label: 'Prompt' }
      ]}
      outputs={[{ id: 'response', position: 'center', label: 'Response' }]}
      width={400}
      height={showSetup ? 480 : 120}
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
              <span className="px-2 py-1 rounded-md bg-slate-700 text-cyan-300">{model}</span>
              <span className="px-2 py-1 rounded-md bg-slate-700">temp {Number(temperature).toFixed(1)}</span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{maxTokens} tokens</span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{prompt.length} chars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4 mt-2 px-4 pb-4">
          {/* Model */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white transition-all"
            >
              <option value="gpt-4">🧠 GPT-4</option>
              <option value="gpt-3.5-turbo">⚡ GPT-3.5 Turbo</option>
              <option value="claude-3">🎭 Claude 3</option>
              <option value="llama-2">🦙 Llama 2</option>
            </select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Temperature</label>
              <span className="text-sm text-cyan-400 font-mono">{Number(temperature).toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Deterministic</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Max Tokens</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white transition-all"
              min="1"
              max="4000"
            />
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Prompt</label>
              <span className="text-[12px] text-slate-400">{prompt.length} chars</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              placeholder="Write your prompt here... You can reference variables like {{name}}"
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400 transition-all resize-y"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono">
              ~{Math.ceil(maxTokens * 0.75)} chars
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};