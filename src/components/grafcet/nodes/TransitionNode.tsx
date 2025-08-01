import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface TransitionNodeData {
  condition?: string;
}

export const TransitionNode = memo(({ data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState((data as any)?.condition || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue((data as any)?.condition || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (data as any).condition = editValue;
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue((data as any)?.condition || '');
    }
  };

  const handleBlur = () => {
    (data as any).condition = editValue;
    setIsEditing(false);
  };

  return (
    <div className="group relative flex items-center">
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "w-3 h-3 !bg-grafcet-connection border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-top-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />
      
      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "w-3 h-3 !bg-grafcet-connection border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-bottom-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />

      {/* Horizontal transition line */}
      <div className="flex items-center">
        <div 
          className={cn(
            "h-1 w-12 bg-grafcet-connection",
            selected && "ring-2 ring-ring ring-offset-2"
          )}
        />
        
        {/* Text input for transition condition */}
        <div className="ml-2 min-w-[80px]">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="bg-transparent border border-grafcet-connection rounded px-1 py-0.5 text-xs outline-none min-w-[80px]"
              placeholder="Condition"
              autoFocus
            />
          ) : (
            <span
              className="text-xs cursor-pointer px-1 py-0.5 hover:bg-accent rounded min-w-[80px] inline-block"
              onDoubleClick={handleDoubleClick}
            >
              {(data as any)?.condition || 'Condition'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});