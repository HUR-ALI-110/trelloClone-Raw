"use client";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

import React, { useEffect } from "react";
import { useBoardStore } from "@/store/BoardStore";
import Column from "./Column";

function Board() {
  const [board, getBoard, setBoardState,updateTodoDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoDB
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    // check if user dragged card outside of board
    if (!destination) {
      return;
    }
    // Handle column Drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // This step is needed as the indexes stored as number 0,1,2,3 etc. instead of id's with DND library
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const endCol: Column = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    };
    if (!startCol || !endCol) return;
    if (source.index === destination.index && startCol === endCol) {
      return;
    }

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);
    if (startCol.id === endCol.id) {
      // same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      // dragging to different column
      const finishtodo = Array.from(endCol.todos);
      finishtodo.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: finishtodo,
      });

      //  Update in DB
      updateTodoDB(todoMoved,endCol.id)
      

      setBoardState({
        ...board,
        columns: newColumns,
      });



    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-3   gap-5 max-w-7xl mx-auto "
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
