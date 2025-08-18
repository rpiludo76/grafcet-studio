import { memo, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { STEP_WIDTH, STEP_HEIGHT } from '../constants';

interface ArrowNodeData {
  text: string;
}

export const ArrowNode = memo(({ data, selected }: NodeProps<ArrowNodeData>) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    if (ref.current) {
      data.text = ref.current.innerText || '→';
    }
  };

  return (
    <div className="group relative">
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          'w-3 h-3 !bg-transparent border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-0',
          '!-top-2 !left-1/2 !transform !-translate-x-1/2'
        )}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          'w-3 h-3 !bg-transparent border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity z-0',
          '!-bottom-2 !left-1/2 !transform !-translate-x-1/2'
        )}
      />
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        className={cn(
          'bg-gray-200 text-foreground border border-black rounded-sm drag-handle shadow-lg',
          'flex items-center justify-center',
          selected && 'border-2 border-red-400 border-dashed'
        )}
        style={{ width: STEP_WIDTH, height: STEP_HEIGHT / 1.5 }}
      >
        {data.text ?? '→'}
      </div>
    </div>
  );
});
