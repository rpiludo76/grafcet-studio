import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { STEP_WIDTH, STEP_HEIGHT } from '../constants';

interface StepNodeData {
  number: number;
  label: string;
  bgColor?: string;
}

export const StepNode = memo(({ id, data, selected }: NodeProps<StepNodeData>) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.number?.toString() || '1');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data.number?.toString() || '1');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newNumber = parseInt(editValue);
      if (!isNaN(newNumber) && newNumber > 0) {
        data.number = newNumber;
        data.label = `${newNumber}`;
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data.number?.toString() || '1');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditValue(data.number?.toString() || '1');
  };

  return (
    <div className="group relative">
      {/* Handles - visible on hover */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "w-3 h-3 !bg-transparent border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-0",
          "!-top-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "w-3 h-3 !bg-transparent border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-0",
          "!-bottom-2 !left-1/2 !transform !-translate-x-1/2"
        )}
      />
      
      {/* Right handle for connecting to actions */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={cn(
          "w-3 h-3 !bg-transparent border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-0",
          "!-right-2 !top-1/2 !transform !-translate-y-1/2"
        )}
      />

      {/* Step node */}
      <div
        className={cn(
          "bg-white text-grafcet-step-foreground border-2 border-black rounded-sm",
          "flex items-center justify-center font-bold text-lg cursor-pointer",
          "drag-handle shadow-lg",
          selected && "border-2 border-red-400 border-dashed"
        )}
        style={{ width: STEP_WIDTH, height: STEP_HEIGHT, backgroundColor: data.bgColor || 'white' }}
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
            className="w-full h-full bg-transparent text-center text-lg font-bold outline-none"
            autoFocus
          />
        ) : (
          <span>{data.label ?? (data as any).number}</span>
        )}
      </div>
    </div>
  );

});
