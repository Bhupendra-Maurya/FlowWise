
import { Handle, Position } from 'reactflow';

export const BaseNode = ({
  id,
  data,
  title,
  children,
  inputs = [],
  outputs = [],
  width = 160,
  height = 60,
  style = {},
  selected = false
}) => {
  const baseStyle = {
    width,
    height,
    border: '1px solid black',
    ...style
  };

  const getHandlePosition = (position, index, total) => {
    switch (position) {
      case 'top-third':
        return `${100 / 3}%`;
      case 'bottom-third':
        return `${200 / 3}%`;
      case 'center':
        return '50%';
      case 'auto':
        return `${((index + 1) * 100) / (total + 1)}%`;
      default:
        return position;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-node border-2 transition-all duration-200 ${selected ? 'border-primary shadow-node-hover' : 'border-gray-200 hover:border-gray-300'
        }`}
      style={{
        width,
        minHeight: height === 'auto' ? 'auto' : height,
        fontSize: '12px',
        ...style
      }}
    >
      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          style={{
            top: getHandlePosition(input.position || 'auto', index, inputs.length),
            width: '8px',
            height: '8px',
          }}
        />
      ))}

      {/* Title Section */}
      <div className="px-2 py-1 text-xs font-medium text-gray-700  border-gray-100">
        <span className="truncate block">{title}</span>
      </div>

      {/* Custom Content */}
      <div className="px-2 py-1 text-xs">
        {children}
      </div>

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          style={{
            top: getHandlePosition(output.position || 'auto', index, outputs.length),
            width: '8px',
            height: '8px',
          }}
        />
      ))}
    </div>
  );
};
