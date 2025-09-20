import { useState, useEffect, useMemo } from 'react';
import { BaseNode } from "../base/BaseNode";
import { useStore } from '../../store/Store';
import { Database as DatabaseIcon } from "lucide-react";

export const DatabaseNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [mode, setMode] = useState(data?.mode || 'query'); // 'query' | 'store'
  const [query, setQuery] = useState(data?.query || 'SELECT * FROM orders WHERE userId = {{id}}');
  const [payloadJson, setPayloadJson] = useState(data?.payloadJson || '{ }');
  const [showSetup, setShowSetup] = useState(false);

  // initialize on mount (same behavior as original)
  useEffect(() => {
    updateNodeField(id, 'mode', mode);
    updateNodeField(id, 'query', query);
    updateNodeField(id, 'payloadJson', payloadJson);
  }, [id]);

  const calcHeight = useMemo(() => {
    if (!showSetup) return 110;
    return mode === 'store' ? 440 : 340;
  }, [showSetup, mode]);

  // UI-only JSON validity hint for payload
  const payloadValid = useMemo(() => {
    if (mode !== 'store') return true;
    try { JSON.parse(payloadJson); return true; } catch { return false; }
  }, [mode, payloadJson]);

  // Short SQL display for collapsed view
  const shortQuery = useMemo(() => {
    const compact = (query || '').replace(/\s+/g, ' ').trim();
    return compact.length > 60 ? compact.slice(0, 57) + '...' : compact || '—';
  }, [query]);

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <DatabaseIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">Database</div>
              <div className="text-slate-400 text-sm">Query / Store</div>
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
        { id: 'query', position: 'auto', label: 'Query' },
        { id: 'vars', position: 'auto', label: 'Vars' },
        { id: 'payload', position: 'auto', label: 'Payload' },
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
              <span className="px-2 py-1 rounded-md bg-slate-700 text-cyan-300">{mode}</span>
              <span className="px-2 py-1 rounded-md bg-slate-700 max-w-[220px] truncate" title={shortQuery}>
                {shortQuery}
              </span>
              {mode === 'store' && <span className="px-2 py-1 rounded-md bg-slate-700">Payload</span>}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${payloadValid ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span>{payloadValid ? 'Ready' : 'Check JSON'}</span>
            </div>
          </div>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4 mt-2 px-4 pb-4">
          {/* Mode */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-sm font-medium text-slate-300 col-span-1">Mode</label>
            <select
              value={mode}
              onChange={(e) => { setMode(e.target.value); updateNodeField(id, 'mode', e.target.value); }}
              className="col-span-2 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white"
            >
              <option value="query">Query</option>
              <option value="store">Store</option>
            </select>
          </div>

          {/* SQL / Template */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">SQL / Template</label>
            <textarea
              rows={4}
              value={query}
              onChange={(e) => { setQuery(e.target.value); updateNodeField(id, 'query', e.target.value); }}
              placeholder='SELECT * FROM orders WHERE userId = {{id}}'
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg font-mono
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400 transition-all"
            />
            <div className="text-[12px] text-slate-400">
              Template variables: {'{{var}}'}
            </div>
          </div>

          {/* Payload JSON */}
          {mode === 'store' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Payload JSON</label>
                <span className={`text-[12px] ${payloadValid ? 'text-slate-400' : 'text-rose-400'}`}>
                  {payloadValid ? 'valid' : 'invalid'}
                </span>
              </div>
              <textarea
                rows={6}
                value={payloadJson}
                onChange={(e) => { setPayloadJson(e.target.value); updateNodeField(id, 'payloadJson', e.target.value); }}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg font-mono
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
              />
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className={`w-2 h-2 rounded-full ${payloadValid ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span>{payloadValid ? 'Ready' : 'Check JSON'}</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono truncate max-w-48" title={shortQuery}>
              {shortQuery}
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};