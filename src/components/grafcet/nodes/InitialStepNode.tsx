import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface InitialStepNodeData {
  number: number;
  label: string;
}

export const InitialStepNode = memo(({ data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState((data as any).number?.toString() || '0');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue((data as any).number?.toString() || '0');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newNumber = parseInt(editValue);
      if (!isNaN(newNumber) && newNumber >= 0) {
        (data as any).number = newNumber;
        (data as any).label = `Étape initiale ${newNumber}`;
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue((data as any).number?.toString() || '0');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditValue((data as any).number?.toString() || '0');
  };

  return (
    <div className="group relative">
      {/* Bottom handle for connecting to next steps */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "w-3 h-3 !bg-grafcet-step-initial border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-bottom-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />
      
      {/* Right handle for connecting to actions */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={cn(
          "w-3 h-3 !bg-grafcet-step-initial border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity",
          "!-right-2 !top-1/2 !transform !-translate-y-1/2"
        )}
      />

      {/* Initial step node - double border to indicate initial */}
      <div className="relative">
        <div
          className={cn(
            "w-12 h-12 bg-grafcet-step-initial text-grafcet-step-initial-foreground border-4 border-grafcet-step-initial rounded-sm",
            "flex items-center justify-center font-bold text-lg cursor-pointer",
            "drag-handle shadow-lg",
            selected && "ring-2 ring-ring ring-offset-2"
          )}
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
            <span>{(data as any).number || 0}</span>
          )}
        </div>
        
        {/* Double border effect */}
        <div className="absolute inset-1 border-2 border-grafcet-step-initial rounded-sm pointer-events-none"></div>
      </div>
    </div>
  );
});
