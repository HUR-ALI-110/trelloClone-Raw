import { ID, databases } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/libs/getTodosGroupedByColumn";
import uploadImage from "@/libs/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoDB: (todo: Todo, columnId: TypedColumns) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumns) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  newTaskType: TypedColumns;
  setNewTaskType: (columnId: TypedColumns) => void;
  image: File | null;
  setImage: (image: File | null) => void;
  addTask: (todo: string, columnId: TypedColumns, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumns, Column>(),
  },
  searchString: "",
  newTaskInput: "",
  setSearchString: (searchString) => set({ searchString }),
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumns) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DB_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id
    );
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  image: null,
  setImage: (image: File | null) => set({ image }),
  newTaskType: "todo",
  setNewTaskType: (columnId: TypedColumns) => set({ newTaskType: columnId }),
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setBoardState: (board) => set({ board }),
  updateTodoDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DB_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  addTask: async (
    todo: string,
    columnId: TypedColumns,
    image?: File | null
  ) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DB_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board:{
          columns:newColumns,
        }
      }
    });
  },
}));
