import { useState, useEffect, useMemo } from 'react';
import { BaseNode } from "../base/BaseNode";
import { useStore } from '../../store/Store';
import { Code2 } from "lucide-react";

export const FunctionNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [code, setCode] = useState(
    data?.code ||
    `// Available: input, vars (object)
// Return the computed value
return input;`
  );
  const [showSetup, setShowSetup] = useState(false);

  // initialize on mount (same behavior)
  useEffect(() => {
    updateNodeField(id, 'code', code);
  }, [id]);

  // Collapsed summary info (UI only)
  const lines = useMemo(() => (code ? code.split(/\r?\n/).length : 0), [code]);
  const chars = code.length;
  const hasReturn = useMemo(() => /\breturn\b/.test(code), [code]);
  const snippet = useMemo(() => {
    const first = (code || '').split('\n').find(l => l.trim() !== '') || '';
    const s = first.trim();
    return s.length > 48 ? s.slice(0, 45) + '...' : (s || '—');
  }, [code]);

  const calcHeight = useMemo(() => (showSetup ? 360 : 110), [showSetup]);

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">Function</div>
              <div className="text-slate-400 text-sm">Custom JavaScript</div>
            </div>
          </div>
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-900 text-white rounded-lg transition-colors font-medium"
          >
            {showSetup ? 'Close' : 'Setup'}
          </button>
        </div>
      }
      inputs={[
        { id: 'input', position: 'auto', label: 'Input' },
        { id: 'vars', position: 'auto', label: 'Vars' },
      ]}
      outputs={[{ id: 'result', position: 'center', label: 'Result' }]}
      width={400}
      height={calcHeight}
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
              <span className="px-2 py-1 rounded-md bg-slate-700" title={snippet}>
                {snippet}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{lines} lines</span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{chars} chars</span>
              <span className={`px-2 py-1 rounded-md bg-slate-700 ${hasReturn ? 'text-cyan-300' : ''}`}>
                return {hasReturn ? '✓' : '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Ready</span>
            </div>
          </div>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4 mt-2 px-4 pb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">JavaScript</label>
            <textarea
              rows={9}
              value={code}
              onChange={(e) => { setCode(e.target.value); updateNodeField(id, 'code', e.target.value); }}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg font-mono
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400 transition-all"
            />
            <div className="text-[12px] text-slate-400">
              Available: input, vars (object). Return the computed value.
              <br />
              Example: return (vars.price || 0) + (vars.tax || 0);
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Ready</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono truncate max-w-48" title={snippet}>
              {snippet}
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};