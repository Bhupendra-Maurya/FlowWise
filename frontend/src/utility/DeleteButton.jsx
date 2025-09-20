// components/controls/DeleteButton.jsx
export const DeleteButton = ({ onClick, title }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 bg-red-600 hover:bg-red-700 border border-red-500 
                 hover:border-red-400 rounded-lg flex items-center justify-center 
                 text-white transition-all duration-300 shadow-lg"
      title={title}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
};