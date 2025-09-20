
import  { useState } from 'react';
import { toast } from 'react-hot-toast';

const submitPipeline = async (nodes, edges) => {
  try {
    const pipelineData = { nodes, edges };
    console.log('Sending data:', pipelineData);

    let response;
    const urls = [
      'http://localhost:8000/pipelines/parse',
      'http://127.0.0.1:8000/pipelines/parse'
    ];
    
    let lastError;
    for (const url of urls) {
      try {
        console.log(`Trying URL: ${url}`);
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pipelineData)
        });
        if (response.ok) {
          console.log(`Success with URL: ${url}`);
          break;
        }
      } catch (error) {
        console.log(`Failed with URL: ${url}`, error.message);
        lastError = error;
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error(`HTTP error! status: ${response?.status}`);
    }

    const result = await response.json();
    showPipelineAlert(result);
    return result;
  } catch (error) {
    console.error('Error submitting pipeline:', error);
    toast.error(`❌ Failed to submit pipeline!\n\nError: ${error.message}`, {
      style: { whiteSpace: 'pre-line' },
    });
    throw error;
  }
};

const showPipelineAlert = (result) => {
  const { num_nodes, num_edges, is_dag } = result;
  const dagStatus = is_dag ? '✅ Valid DAG' : '❌ Not a DAG';

  const message = `
🚀 Pipeline Analysis Complete!

🔵 Nodes: ${num_nodes}
🔗 Edges: ${num_edges}
${dagStatus}
`.trim();

  toast(<div style={{ whiteSpace: 'pre-line' }}>{message}</div>);
};

export const SubmitButton = ({ nodes = [], edges = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('SubmitButton - nodes:', nodes);
      console.log('SubmitButton - edges:', edges);
      if (!nodes || !edges) throw new Error('No nodes or edges data provided');
      const result = await submitPipeline(nodes, edges);
      console.log('Pipeline analysis result:', result);
    } catch (error) {
      console.error('Failed to submit pipeline:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasWorkflow = nodes.length > 0;

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleSubmit}
        disabled={!hasWorkflow || isSubmitting}
        className={`px-6 py-2 font-semibold text-sm rounded-lg transition-all duration-300 
                   flex items-center gap-2 shadow-lg ${
          hasWorkflow && !isSubmitting
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl transform hover:scale-105"
            : "bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600"
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 19h.01M12 3v16M3 12h18"
              />
            </svg>
            Run
          </>
        )}
      </button>

      <div className="text-xs text-gray-500">
        Nodes: {nodes?.length || 0} | Edges: {edges?.length || 0}
      </div>
    </div>
  );
};