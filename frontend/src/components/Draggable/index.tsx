import { useDraggable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface DraggableProps {
  id: string;  // id is a string that uniquely identifies the draggable item
  children: ReactNode;  // children is the content to be rendered inside the draggable element
}

export function Draggable({ id, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
