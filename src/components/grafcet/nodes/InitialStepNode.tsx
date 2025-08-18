import { memo, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { STEP_WIDTH, STEP_HEIGHT } from '../constants';

interface InitialStepNodeData {
  number: number;
  label: string;
  bgColor?: string;
}

export const InitialStepNode = memo(({ id, data, selected }: NodeProps<InitialStepNodeData>) => {
  const { setNodes } = useReactFlow();
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

      {/* Initial step node - double border to indicate initial */}
      <div className="relative">
        <div
          className={cn(
            "bg-white text-grafcet-step-initial-foreground border-2 border-black rounded-sm",
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
            <span>{(data as any).number || 0}</span>
          )}
        </div>
        
        {/* Double border effect */}
        <div className="absolute inset-1 border-2 border-black rounded-sm pointer-events-none"></div>
      </div>
    </div>
  );

});
