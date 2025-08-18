import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface TransitionNodeData {
  condition?: string;
  edgeId: string;
}

export const TransitionNode = memo(({ data, selected }: NodeProps) => {
  const d = data as any;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(d?.condition || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(d?.condition || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (d as any).condition = editValue;
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(d?.condition || '');
    }
  };

  const handleBlur = () => {
    (d as any).condition = editValue;
    setIsEditing(false);
  };

  return (
    <div className="group relative flex items-center">
      <Handle type="target" position={Position.Left} className="hidden" />
      <Handle type="source" position={Position.Right} className="hidden" />

      {/* Horizontal transition line */}
      <div className="flex items-center">
        <div 
          className={cn(
            "h-0.5 w-6 bg-grafcet-connection",
            selected && "border-2 border-red-400 border-dashed"
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
              autoFocus
            />
          ) : (
            <span
              className="text-xs cursor-pointer px-1 py-0.5 hover:bg-accent rounded min-w-[80px] inline-block"
              onDoubleClick={handleDoubleClick}
            >
              {(d as any)?.condition || 'Condition'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});