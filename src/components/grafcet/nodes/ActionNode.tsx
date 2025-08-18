import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { STEP_HEIGHT } from '../constants';

interface ActionNodeData {
  text: string;
  bgColor?: string;
}

export const ActionNode = memo(({ id, data, selected }: NodeProps) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState((data as any).text || 'Action');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue((data as any).text || 'Action');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (data as any).text = editValue || 'Action';
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue((data as any).text || 'Action');
    }
  };

  const handleBlur = () => {
    (data as any).text = editValue || 'Action';
    setIsEditing(false);
  };

  return (
    <div className="group relative">
      {/* Left handle for connecting to steps */}
      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          "w-3 h-3 !bg-transparent border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-0",
          "!-left-2 !top-1/2 !transform !-translate-y-1/2"
        )}
      />

      {/* Action node */}
      <div
        className={cn(
          "min-w-24 max-w-48 w-24 bg-grafcet-action text-grafcet-action-foreground border-2 border-black",
          "flex items-center justify-center font-medium text-sm cursor-pointer",
          "drag-handle shadow-lg rounded-sm",
          selected && "border-2 border-red-400 border-dashed"
        )}
        style={{ height: STEP_HEIGHT, backgroundColor: (data as any).bgColor || 'hsl(var(--grafcet-action))' }}
        onDoubleClick={handleDoubleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const color = e.dataTransfer.getData('application/grafcet-color');
          if (color) {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === id ? { ...n, data: { ...n.data, bgColor: color } } : n
              )
            );
          }
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full bg-transparent text-center text-sm font-medium outline-none"
            autoFocus
          />
        ) : (
          <span className="text-center">{(data as any).text || 'Action'}</span>
        )}
      </div>
    </div>
  );

});
