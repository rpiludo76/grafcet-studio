import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { STEP_WIDTH, STEP_HEIGHT } from '../constants';

interface StepNodeData {
  number: number;
  label: string;
}

export const StepNode = memo(({ data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState((data as any).number?.toString() || '1');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue((data as any).number?.toString() || '1');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newNumber = parseInt(editValue);
      if (!isNaN(newNumber) && newNumber > 0) {
        (data as any).number = newNumber;
        (data as any).label = `Étape ${newNumber}`;
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue((data as any).number?.toString() || '1');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditValue((data as any).number?.toString() || '1');
  };

  return (
    <div className="group relative">
      {/* Handles - visible on hover */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "w-3 h-3 !bg-grafcet-step border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-top-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "w-3 h-3 !bg-grafcet-step border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-bottom-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />
      
      {/* Right handle for connecting to actions */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={cn(
          "w-3 h-3 !bg-grafcet-step border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-right-2 !top-1/2 !transform !-translate-y-1/2"
        )}
      />

      {/* Step node */}
      <div
        className={cn(
          "bg-grafcet-step text-grafcet-step-foreground border-2 border-grafcet-step rounded-sm",
          "flex items-center justify-center font-bold text-lg cursor-pointer",
          "drag-handle shadow-lg",
          selected && "ring-2 ring-ring ring-offset-2"
        )}
		style={{ width: STEP_WIDTH, height: STEP_HEIGHT }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full h-full bg-transparent text-center text-lg font-bold outline-none"
            autoFocus
          />
        ) : (
          <span>{(data as any).number || 1}</span>
        )}
      </div>
    </div>
  );
});