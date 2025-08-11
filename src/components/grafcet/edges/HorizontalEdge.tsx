import { memo, useCallback, useMemo } from 'react';
import {
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
  useReactFlow,
} from '@xyflow/react';
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
  data,
}: EdgeProps<{ double?: boolean }>) => {
  const { setEdges } = useReactFlow();

  const isDouble = useMemo(() => Boolean(data?.double), [data]);

  const handleDoubleClick = useCallback(() => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: { ...edge.data, double: !edge.data?.double },
            }
          : edge,
      ),
    );
  }, [id, setEdges]);

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
    <>
      {isDouble && (
        <BaseEdge
          id={`${id}-overlay`}
          path={edgePath}
          onDoubleClick={handleDoubleClick}
          style={{
            stroke: 'hsl(var(--background))',
            strokeWidth: 2,
            pointerEvents: 'stroke',
          }}
        />
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        onDoubleClick={handleDoubleClick}
        style={{
          stroke: 'hsl(var(--grafcet-connection))',
          strokeWidth: isDouble ? 4 : 2,
          pointerEvents: 'stroke',
          ...style,
        }}
      />
    </>
  );
});
