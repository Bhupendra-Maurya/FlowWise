

import { useState, useEffect, useMemo } from 'react';
import { BaseNode } from "../base/BaseNode";
import { Globe } from "lucide-react";
import { useStore } from '../../store/Store';

export const APIRequestNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com/users/{{userId}}');
  const [headersJson, setHeadersJson] = useState(data?.headersJson || '{ "Authorization": "Bearer {{token}}" }');
  const [paramsJson, setParamsJson] = useState(data?.paramsJson || '{ "include": "orders" }');
  const [bodyJson, setBodyJson] = useState(data?.bodyJson || '{ }');
  const [showSetup, setShowSetup] = useState(false);

  // initialize (same as your original)
  useEffect(() => {
    updateNodeField(id, 'method', method);
    updateNodeField(id, 'url', url);
    updateNodeField(id, 'headersJson', headersJson);
    updateNodeField(id, 'paramsJson', paramsJson);
    updateNodeField(id, 'bodyJson', bodyJson);
  }, [id]); // initialize only once

  const calcHeight = useMemo(() => {
    if (!showSetup) return 110;
    return method !== 'GET' ? 520 : 440;
  }, [showSetup, method]);

  // UI-only JSON validation badges
  const isValidJson = (s) => {
    try { JSON.parse(s); return true; } catch { return false; }
  };
  const headersValid = isValidJson(headersJson);
  const paramsValid = isValidJson(paramsJson);
  const bodyValid = method === 'GET' ? true : isValidJson(bodyJson);

  // Short URL display for the collapsed view
  const shortUrl = useMemo(() => {
    try {
      const candidate = url.replace(/\{\{.*?\}\}/g, 'x');
      const u = new URL(candidate);
      return u.host + u.pathname.replace(/\/$/, '');
    } catch {
      return url.length > 38 ? url.slice(0, 35) + '...' : url;
    }
  }, [url]);

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">API Request</div>
              <div className="text-slate-400 text-sm">HTTP client node</div>
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
        { id: 'url', position: 'auto', label: 'URL' },
        { id: 'headers', position: 'auto', label: 'Headers' },
        { id: 'params', position: 'auto', label: 'Params' },
        { id: 'body', position: 'auto', label: 'Body' },
      ]}
      outputs={[{ id: 'response', position: 'center', label: 'Response' }]}
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
              <span className="px-2 py-1 rounded-md bg-slate-700 text-cyan-300">{method}</span>
              <span className="px-2 py-1 rounded-md bg-slate-700">{shortUrl}</span>
              {method !== 'GET' && <span className="px-2 py-1 rounded-md bg-slate-700">Body</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${headersValid && paramsValid && bodyValid ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span>{headersValid && paramsValid && bodyValid ? 'Ready' : 'Check JSON'}</span>
            </div>
          </div>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4 mt-2 px-4 pb-4">
          {/* Method */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <label className="text-sm font-medium text-slate-300 col-span-1">Method</label>
            <select
              value={method}
              onChange={(e) => { setMethod(e.target.value); updateNodeField(id, 'method', e.target.value); }}
              className="col-span-2 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">URL</label>
            <input
              value={url}
              onChange={(e) => { setUrl(e.target.value); updateNodeField(id, 'url', e.target.value); }}
              placeholder="https://api.example.com/users/{{userId}}"
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400"
            />
          </div>

          {/* Headers & Params */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Headers JSON</label>
                <span className={`text-[11px] ${headersValid ? 'text-slate-400' : 'text-rose-400'}`}>
                  {headersValid ? 'valid' : 'invalid'}
                </span>
              </div>
              <textarea
                rows={5}
                value={headersJson}
                onChange={(e) => { setHeadersJson(e.target.value); updateNodeField(id, 'headersJson', e.target.value); }}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg font-mono
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Params JSON</label>
                <span className={`text-[11px] ${paramsValid ? 'text-slate-400' : 'text-rose-400'}`}>
                  {paramsValid ? 'valid' : 'invalid'}
                </span>
              </div>
              <textarea
                rows={5}
                value={paramsJson}
                onChange={(e) => { setParamsJson(e.target.value); updateNodeField(id, 'paramsJson', e.target.value); }}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg font-mono
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
              />
            </div>
          </div>

          {/* Body JSON */}
          {method !== 'GET' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Body JSON</label>
                <span className={`text-[11px] ${bodyValid ? 'text-slate-400' : 'text-rose-400'}`}>
                  {bodyValid ? 'valid' : 'invalid'}
                </span>
              </div>
              <textarea
                rows={6}
                value={bodyJson}
                onChange={(e) => { setBodyJson(e.target.value); updateNodeField(id, 'bodyJson', e.target.value); }}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg font-mono
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white"
              />
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className={`w-2 h-2 rounded-full ${headersValid && paramsValid && bodyValid ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span>{headersValid && paramsValid && bodyValid ? 'Ready' : 'Check JSON'}</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono truncate max-w-48" title={url}>
              {shortUrl}
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};