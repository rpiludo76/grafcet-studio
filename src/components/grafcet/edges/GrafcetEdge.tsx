import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  EdgeProps,
} from '@xyflow/react';

export const GrafcetEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const THRESHOLD = 5;

  let edgePath: string;
  let labelX: number;
  let labelY: number;

  if (Math.abs(sourceX - targetX) < THRESHOLD) {
    edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    labelX = (sourceX + targetX) / 2;
    labelY = (sourceY + targetY) / 2;
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 0,
    });
  }

  return (
    <>
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
      {(data as any)?.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute bg-white px-2 py-1 text-xs border border-border rounded shadow-sm pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {(data as any).label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
