export const DraggableNode = ({
  type,
  label,
  icon,
  description,
  collapsed = false,
}) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (event) => {
    event.target.style.cursor = "grab";
  };

  if (collapsed) {
    return (
      <div
        className="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center cursor-grab hover:border-primary hover:shadow-md transition-all duration-200 group"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        draggable
        title={label}
      >
        <span className="text-lg group-hover:scale-110 transition-transform">
          {icon || label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-grab hover:border-primary hover:shadow-md transition-all duration-200 group"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      draggable
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">{icon || label.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-sm group-hover:text-primary transition-colors">
            {label}
          </div>
          {description && (
            <div className="text-xs text-gray-500 truncate">{description}</div>
          )}
        </div>
      </div>
    </div>
  );
};
