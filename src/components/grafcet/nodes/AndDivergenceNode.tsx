import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { DIVERGENCE_INITIAL_WIDTH } from '../constants';

interface AndDivergenceData {
  width: number;
}

export const AndDivergenceNode = memo(({ id, data, selected }: NodeProps<AndDivergenceData>) => {
  const { updateNodeInternals } = useReactFlow();
  const [width, setWidth] = useState(data?.width || DIVERGENCE_INITIAL_WIDTH);

  useEffect(() => {
    updateNodeInternals(id);
  }, [width, id, updateNodeInternals]);

  const startResize = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - startX;
      const newWidth =
        direction === 'right'
          ? Math.max(50, startWidth + delta)
          : Math.max(50, startWidth - delta);
      setWidth(newWidth);
      if (data) {
        data.width = newWidth;
      }
      updateNodeInternals(id);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className={cn('relative group', selected && 'ring-2 ring-ring ring-offset-2')} style={{ width }}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-full h-1 !-top-1 !bg-grafcet-connection !border-0 !rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="space-y-1 drag-handle" style={{ width }}>
        <div className="h-0.5 bg-grafcet-connection w-full" />
        <div className="h-0.5 bg-grafcet-connection w-full" />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-full h-1 !-bottom-1 !bg-grafcet-connection !border-0 !rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div
        className="absolute top-0 bottom-0 left-0 w-1 bg-grafcet-connection cursor-ew-resize"
        onMouseDown={(e) => startResize(e, 'left')}
      />
      <div
        className="absolute top-0 bottom-0 right-0 w-1 bg-grafcet-connection cursor-ew-resize"
        onMouseDown={(e) => startResize(e, 'right')}
      />
    </div>
  );
});