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

      {/* Horizontal transition line */}
      <div className="flex items-center">
        <div 
          className={cn(
            "h-0.5 w-6 bg-grafcet-connection",
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