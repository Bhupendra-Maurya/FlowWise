
import { useState, useEffect } from 'react';
import { BaseNode } from "../base/BaseNode";
import { useStore } from '../../store/Store';
import { GitBranch } from "lucide-react";

export const ConditionNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [expression, setExpression] = useState(data?.expression || '{{sentiment}} == "positive"');
  const [trueLabel, setTrueLabel] = useState(data?.trueLabel || 'true');
  const [falseLabel, setFalseLabel] = useState(data?.falseLabel || 'false');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    updateNodeField(id, 'expression', expression);
    updateNodeField(id, 'trueLabel', trueLabel);
    updateNodeField(id, 'falseLabel', falseLabel);
  }, [id]); // initialize on mount

  const onExprChange = (e) => {
    const v = e.target.value;
    setExpression(v);
    updateNodeField(id, 'expression', v);
  };

  const onTrueLabelChange = (e) => {
    const v = e.target.value;
    setTrueLabel(v);
    updateNodeField(id, 'trueLabel', v);
  };

  const onFalseLabelChange = (e) => {
    const v = e.target.value;
    setFalseLabel(v);
    updateNodeField(id, 'falseLabel', v);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title={
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-medium text-base">Condition</div>
              <div className="text-slate-400 text-sm">If / Else</div>
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
      inputs={[{ id: 'vars', position: 'center', label: 'Vars' }]}
      outputs={[
        { id: 'true', position: 'top-third', label: 'True' },
        { id: 'false', position: 'bottom-third', label: 'False' },
      ]}
      width={400}
      height={showSetup ? 260 : 110}
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
              <span
                className="px-2 py-1 rounded-md bg-slate-700 max-w-[200px] truncate"
                title={expression}
              >
                {expression}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-700" title={`True → ${trueLabel}`}>
                T: {trueLabel}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-700" title={`False → ${falseLabel}`}>
                F: {falseLabel}
              </span>
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
          {/* Expression */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Expression</label>
            <input
              type="text"
              value={expression}
              onChange={onExprChange}
              placeholder={`e.g. {{sentiment}} == "positive"`}
              className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                         text-white placeholder-slate-400 transition-all"
            />
            <div className="text-[12px] text-slate-400">
              Use variables with {'{{var}}'} syntax. The result should be boolean.
            </div>
          </div>

          {/* Labels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">True Label</label>
              <input
                type="text"
                value={trueLabel}
                onChange={onTrueLabelChange}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                           text-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">False Label</label>
              <input
                type="text"
                value={falseLabel}
                onChange={onFalseLabelChange}
                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                           text-white transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Ready</span>
            </div>
            <div className="text-sm text-cyan-400 font-mono truncate max-w-40" title={expression}>
              {expression}
            </div>
          </div>
        </div>
      )}
    </BaseNode>
  );
};