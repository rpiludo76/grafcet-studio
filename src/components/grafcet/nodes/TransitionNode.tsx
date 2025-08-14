import { memo, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface TransitionNodeData {
  condition?: string;
  edgeId: string;
}

export const TransitionNode = memo(({ data, selected }: NodeProps<TransitionNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data?.condition || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data?.condition || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      data.condition = editValue;
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data?.condition || '');
    }
  };

  const handleBlur = () => {
    data.condition = editValue;
    setIsEditing(false);
  };

  return (
    <div className="group relative flex items-center">

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
              placeholder="Condition"
              autoFocus
            />
          ) : (
            <span
              className="text-xs cursor-pointer px-1 py-0.5 hover:bg-accent rounded min-w-[80px] inline-block"
              onDoubleClick={handleDoubleClick}
            >
              {data?.condition || 'Condition'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});