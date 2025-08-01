import { memo } from 'react';
import {
  BaseEdge,
  getStraightPath,
  EdgeProps,
} from '@xyflow/react';

export const HorizontalEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: 'hsl(var(--grafcet-connection))',
        strokeWidth: 2,
        ...style,
      }}
    />
  );
});