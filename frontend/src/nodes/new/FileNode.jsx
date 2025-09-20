import { useState, useEffect, useMemo } from 'react';
import { BaseNode } from "../base/BaseNode";
import { useStore } from '../../store/Store';
import { FileText } from "lucide-react";

export const FileNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [mode, setMode] = useState(data?.mode || 'upload'); // 'upload' | 'download'
  const [parseAs, setParseAs] = useState(data?.parseAs || 'text'); // 'text' | 'json'
  const [fileName, setFileName] = useState(data?.fileName || '');
  const [contentPreview, setContentPreview] = useState(data?.contentPreview || '');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    updateNodeField(id, 'mode', mode);
    updateNodeField(id, 'parseAs', parseAs);
    updateNodeField(id, 'fileName', fileName);
    updateNodeField(id, 'contentPreview', contentPreview);
  }, [id]);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    updateNodeField(id, 'fileName', file.name);
    const text = await file.text();
    const preview = text.slice(0, 2000); // cap preview
    setContentPreview(preview);
    updateNodeField(id, 'contentPreview', preview);
  };

  const calcHeight = useMemo(() => {
    if (!showSetup) return 110;
    return mode === 'upload' ? 420 : 260;
  }, [showSetup, mode]);

  // UI-only validity (for JSON preview)
  const jsonValid = useMemo(() => {
    if (parseAs !== 'json') return true;
    if (!contentPreview) return true;
    try { JSON.parse(contentPreview); return true; } catch { return false; }
  }, [parseAs, contentPreview]);

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">File</div>
              <div className="text-slate-400 text-sm">Upload / Download</div>
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
      inputs={[{ id: 'content', position: 'center', label: 'Content (for download)' }]}
      outputs={[{ id: 'content', position: 'center', label: 'Content' }]}
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
              <span className="px-2 py-1 rounded-md bg-slate-700">{parseAs}</span>
              <span className="px-2 py-1 rounded-md bg-slate-700 max-w-[160px] truncate" title={fileName || 'none'}>
                {fileName || '—'}
              </span>
              {mode === 'upload' && (
                <span className="px-2 py-1 rounded-md bg-slate-700">
                  {contentPreview ? `${contentPreview.length} chars` : 'no content'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${(mode === 'upload' ? true : !!fileName) && jsonValid ? 'bg-green-400' : 'bg-amber-400'
                  }`}
              />
              <span>{(mode === 'upload' ? true : !!fileName) && jsonValid ? 'Ready' : 'Waiting'}</span>
            </div>
          </div>
        </div>
      )}

      {showSetup && (
        <div className="space-y-4 mt-2 px-4 pb-4">
          {/* Mode + Parse As */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Mode</label>
              <select
                value={mode}
                onChange={(e) => { setMode(e.target.value); updateNodeField(id, 'mode', e.target.value); }}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                           text-white"
              >
                <option value="upload">Upload</option>
                <option value="download">Download</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Parse As</label>
              <select
                value={parseAs}
                onChange={(e) => { setParseAs(e.target.value); updateNodeField(id, 'parseAs', e.target.value); }}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                           text-white"
              >
                <option value="text">Text</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>

          {/* Upload */}
          {mode === 'upload' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Upload File</label>
                <input type="file" onChange={onFileChange} className="w-full text-sm text-slate-300" />
                <div className="text-[12px] text-slate-400 truncate">File: {fileName || 'none'}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[12px] text-slate-400">Preview (first 2k chars)</div>
                {parseAs === 'json' && (
                  <div className={`text-[12px] ${jsonValid ? 'text-slate-400' : 'text-rose-400'}`}>
                    {jsonValid ? 'valid JSON' : 'invalid JSON'}
                  </div>
                )}
              </div>
              <div className="max-h-32 overflow-auto border border-slate-600 bg-slate-800 rounded-lg p-2 text-[12px] font-mono text-slate-200">
                {contentPreview ? contentPreview : <span className="text-slate-500">No content yet</span>}
              </div>
            </div>
          ) : (
            // Download
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => { setFileName(e.target.value); updateNodeField(id, 'fileName', e.target.value); }}
                  placeholder="output.txt"
                  className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                             text-white placeholder-slate-400 transition-all"
                />
              </div>
              <div className="text-[12px] text-slate-400">
                Provide content via the input handle to generate a downloadable file.
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div
                className={`w-2 h-2 rounded-full ${(mode === 'upload' ? true : !!fileName) && jsonValid ? 'bg-green-400' : 'bg-amber-400'
                  }`}
              />
              <span>{(mode === 'upload' ? true : !!fileName) && jsonValid ? 'Ready' : 'Waiting'}</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono truncate max-w-40" title={fileName || '—'}>
              {fileName || '—'}
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};