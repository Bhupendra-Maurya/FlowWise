import { useState, useEffect, useRef, useMemo } from "react";
import { BaseNode } from "../base/BaseNode";

const NODE_WIDTH = 400; // match InputNode

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "");
  const [dimensions, setDimensions] = useState({ width: NODE_WIDTH, height: 80 });
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const hiddenDivRef = useRef(null);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Extract variables from text using regex (unchanged)
  const detectedVariables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const variables = new Set();
    let match;
    while ((match = regex.exec(currText)) !== null) {
      variables.add(match[1].trim());
    }
    return Array.from(variables).sort();
  }, [currText]);

  // Create input handles for detected variables (unchanged)
  const inputHandles = detectedVariables.map((variable) => ({
    id: variable,
    position: detectedVariables.length === 1 ? "center" : "auto",
  }));

  // Calculate dynamic height (width fixed to NODE_WIDTH)
  useEffect(() => {
    if (textareaRef.current && hiddenDivRef.current) {
      hiddenDivRef.current.textContent = currText || " ";

      // Approximate inner text width for wrapping:
      // Base width (400) - outer paddings/borders (~48) = 352
      const textWidthPx = NODE_WIDTH - 48;
      hiddenDivRef.current.style.width = `${textWidthPx}px`;

      const textHeight = hiddenDivRef.current.scrollHeight;

      const minHeight = 80;
      const padding = 48;
      const variableDisplayHeight = detectedVariables.length > 0 ? 25 : 0;

      const newHeight = Math.max(
        textHeight + padding + 35 + variableDisplayHeight,
        minHeight
      );

      setDimensions({ width: NODE_WIDTH, height: newHeight });
    }
  }, [currText, detectedVariables.length]);

  return (
    <>
      {/* Hidden div for measuring text dimensions (unchanged except width fix) */}
      <div
        ref={hiddenDivRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "14px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: "1.5",
          width: `${NODE_WIDTH - 48}px`,
          height: "auto",
          padding: "0",
          margin: "0",
          border: "none",
          outline: "none",
        }}
        aria-hidden="true"
      />

      <BaseNode
        id={id}
        data={data}
        title={
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-700 rounded-md flex items-center justify-center">
              <svg
                className="w-3 h-3 text-cyan-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className="text-white font-medium">Text Content</span>
          </div>
        }
        inputs={inputHandles}
        outputs={[{ id: "output", position: "center" }]}
        width={NODE_WIDTH}
        height={dimensions.height}
        style={{
          transition: "width 0.2s ease-out, height 0.2s ease-out",
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your text. Use {{variable}} for inputs"
            className="text-sm bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-slate-400 transition-all w-full"
            style={{
              height: `${
                dimensions.height - (detectedVariables.length > 0 ? 85 : 60)
              }px`,
              padding: "4px 4px",
              lineHeight: "1.2",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              outline: "none",
              overflow: "hidden",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              boxSizing: "border-box",
              boxShadow: isFocused
                ? "inset 0 1px 2px rgba(0,0,0,0.15)"
                : "none",
            }}
            spellCheck="false"
          />

          {detectedVariables.length > 0 && (
            <div className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg mt-1">
              <div className="text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wide">
                🔗 Input Variables ({detectedVariables.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {detectedVariables.map((variable) => (
                  <span
                    key={variable}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800/60 text-white rounded-md text-[10px] font-medium ring-1 ring-slate-600"
                  >
                    <span className="w-1.5 h-1.5 bg-cyan-300/80 rounded-full" />
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-right -mt-0.5 font-medium flex justify-between items-center">
            <span>
              {detectedVariables.length > 0 &&
                `${detectedVariables.length} variable${
                  detectedVariables.length === 1 ? "" : "s"
                } detected`}
            </span>
            <span>{currText.length} characters</span>
          </div>
        </div>
      </BaseNode>
    </>
  );
};