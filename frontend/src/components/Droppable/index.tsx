import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface DroppableProps {
  id: string;  // id is a string that uniquely identifies the droppable area
  children: ReactNode;  // children is the content to be rendered inside the droppable area
}
export function Droppable({ id, children }:DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? 'lightgreen' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
