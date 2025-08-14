import { memo } from 'react';
import { BaseEdge, getSmoothStepPath, EdgeProps } from '@xyflow/react';
import { SELECTED_LINK_COLOR } from '../constants';

// Actual diameter of connection handles in pixels
const HANDLE_DIAMETER = 16;

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
  selected,
  }: EdgeProps) => {
    // Adjust X coordinates to start/end at node borders instead of handle centers
    const srcX = sourceX - HANDLE_DIAMETER;
    const tgtX = targetX + HANDLE_DIAMETER;

    const [edgePath] = getSmoothStepPath({
      sourceX: srcX,
      sourceY,
      targetX: tgtX,
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
        zIndex: 0,
        stroke: 'hsl(var(--grafcet-connection))',
        strokeWidth: 2,
        pointerEvents: 'stroke',
        ...style,
        ...(selected && {
          stroke: SELECTED_LINK_COLOR,
          strokeDasharray: '4 4',
        }),
      }}
    />
  );
});