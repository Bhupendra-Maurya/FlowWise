
import { useState } from "react";
import { BaseNode } from "../base/BaseNode";
import { LogIn } from "lucide-react";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");
  const [defaultValue, setDefaultValue] = useState(data?.defaultValue || "");
  const [showSetup, setShowSetup] = useState(false);

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setInputType(e.target.value);
  const handleDefaultValueChange = (e) => setDefaultValue(e.target.value);

  const displayDefault =
    inputType === "Boolean"
      ? defaultValue === "" ? "—" : defaultValue
      : defaultValue === "" ? "—" : defaultValue;

  return (
    <>
      <BaseNode
        id={id}
        data={data}
        title={
          <div className="flex items-center justify-between w-full p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <LogIn className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-medium text-base">Input</div>
                <div className="text-slate-400 text-sm">Data input node</div>
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
        outputs={[{ id: "value", position: "center", label: "Value" }]}
        width={400}
        height={showSetup ? 350 : 110}
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
                  {currName}
                </span>
                <span className="px-2 py-1 rounded-md bg-slate-700">
                  {inputType}
                </span>
                <span className="px-2 py-1 rounded-md bg-slate-700 max-w-[160px] truncate" title={displayDefault}>
                  {displayDefault}
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
          <div className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Variable Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Variable Name
                </label>
                <input
                  type="text"
                  value={currName}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                           text-white placeholder-slate-400 transition-all"
                  placeholder="my_variable"
                />
              </div>

              {/* Input Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Data Type
                </label>
                <select
                  value={inputType}
                  onChange={handleTypeChange}
                  className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                           text-white transition-all"
                >
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Boolean">Boolean</option>
                  <option value="File">File</option>
                  <option value="Date">Date</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              {/* Default Value Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Default Value
                </label>
                {inputType === "Boolean" ? (
                  <select
                    value={defaultValue}
                    onChange={handleDefaultValueChange}
                    className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                             text-white transition-all"
                  >
                    <option value="">Select...</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={
                      inputType === "Number"
                        ? "number"
                        : inputType === "Date"
                          ? "date"
                          : inputType === "Email"
                            ? "email"
                            : "text"
                    }
                    value={defaultValue}
                    onChange={handleDefaultValueChange}
                    className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                             text-white placeholder-slate-400 transition-all"
                    placeholder={`Enter default ${inputType.toLowerCase()}...`}
                  />
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ready</span>
                </div>
                <div className="text-sm text-cyan-400 font-mono truncate max-w-24" title={currName}>
                  {currName}
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseNode>
    </>
  );
};