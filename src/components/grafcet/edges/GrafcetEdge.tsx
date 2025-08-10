import { memo, useCallback, useMemo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  useReactFlow,
} from '@xyflow/react';

// Draggable orthogonal Grafcet edge with adjustable horizontal branch (centerY)
export const GrafcetEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const { setEdges, screenToFlowPosition } = useReactFlow();

  // Grid for snapping (fallback to 20 if not provided in edge data)
  const grid = (data as any)?.grid ?? 20;

  const defaultCenterY = useMemo(
    () => Math.round(((sourceY + targetY) / 2) / grid) * grid,
    [sourceY, targetY, grid]
  );

  const centerY = (data as any)?.centerY ?? defaultCenterY;

  // Build orthogonal path: vertical -> horizontal (draggable) -> vertical
  const edgePath = useMemo(() => {
    return `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;
  }, [sourceX, sourceY, targetX, targetY, centerY]);

  const labelX = useMemo(() => (sourceX + targetX) / 2, [sourceX, targetX]);
  const labelY = centerY;

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const onMove = (ev: MouseEvent) => {
      const p = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
      // Snap to grid on Y axis only and clamp between source/target
      const minY = Math.min(sourceY, targetY) + 2;
      const maxY = Math.max(sourceY, targetY) - 2;
      let newY = Math.round(p.y / grid) * grid;
      newY = Math.max(Math.min(newY, maxY), minY);

      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === id
            ? {
                ...ed,
                data: { ...(ed.data || {}), centerY: newY, grid },
              }
            : ed
        )
      );
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [id, grid, screenToFlowPosition, setEdges, sourceY, targetY]);

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

      {/* Drag handle to reposition the horizontal segment */}
      <EdgeLabelRenderer>
        <div
          className="absolute z-[1] nodrag nopan cursor-ns-resize rounded-full border bg-background shadow"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            width: 14,
            height: 14,
            borderColor: 'hsl(var(--border))',
          }}
          onMouseDown={onDragStart}
          aria-label="Déplacer la branche horizontale"
        />
      </EdgeLabelRenderer>
    </>
  );
});
