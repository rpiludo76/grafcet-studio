import { memo } from 'react';
import { BaseEdge, getSmoothStepPath, EdgeProps } from '@xyflow/react';

export const HorizontalEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: 'hsl(var(--grafcet-connection))',
        strokeWidth: 2,
        pointerEvents: 'stroke',
        ...style,
      }}
    />
  );
});