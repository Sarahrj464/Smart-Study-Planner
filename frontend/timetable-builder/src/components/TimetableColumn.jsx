import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TimetableItem from "./TimetableItem";

export default function TimetableColumn({ column, index }) {
  return (
    <div className="flex flex-col bg-white rounded-md p-2 shadow-sm">
      <div className="text-sm font-semibold mb-2">{column.day}</div>
      <Droppable droppableId={`col-${index}`} type="ITEM">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[120px] p-2 rounded-md ${snapshot.isDraggingOver ? "bg-sky-50" : ""}`}
          >
            {column.items.map((item, i) => (
              <Draggable draggableId={item.id} index={i} key={item.id}>
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                  >
                    <TimetableItem item={item} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
