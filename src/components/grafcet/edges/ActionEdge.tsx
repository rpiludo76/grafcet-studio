import { memo, useCallback } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, useReactFlow } from '@xyflow/react';

import { SELECTED_LINK_COLOR } from '../constants';

const HANDLE_DIAMETER = 16;

interface ActionEdgeData {
  targetX: number;
  targetY: number;
  actionId: string;
}

export const ActionEdge = memo(({ id, sourceX, sourceY, markerEnd, style = {}, data, selected }: EdgeProps) => {
  const { setEdges } = useReactFlow();

  const targetX = typeof (data as any)?.targetX === 'number' ? (data as any).targetX : sourceX;
  const targetY = typeof (data as any)?.targetY === 'number' ? (data as any).targetY : sourceY;
  const actionId: string = typeof (data as any)?.actionId === 'string' ? (data as any).actionId : 'X';

  const srcX = sourceX - HANDLE_DIAMETER;

  const edgePath = `M ${srcX} ${sourceY} L ${targetX} ${sourceY} L ${targetX} ${targetY}`;

  const updateAction = useCallback(
    (value: string) => {
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === id
            ? { ...ed, data: { ...(ed.data as unknown as ActionEdgeData), actionId: value } }
            : ed
        )
      );
    },
    [id, setEdges]
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const val = e.currentTarget.textContent?.trim() || 'X';
      updateAction(val);
    },
    [updateAction]
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).blur();
    }
  }, []);

  return (
    <>
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
      <EdgeLabelRenderer>
        <div
          className="absolute z-[1] nodrag nopan bg-background text-xs text-center outline-none w-4"
          style={{
            transform: `translate(-50%, -50%) translate(${targetX}px, ${targetY + 16}px)`,
            pointerEvents: 'all',
          }}
          contentEditable
          suppressContentEditableWarning
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        >
          {actionId}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});