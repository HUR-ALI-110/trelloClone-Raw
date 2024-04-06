import { databases } from "@/appwrite";

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DB_ID!,
    process.env.NEXT_PUBLIC_COLLECTION_ID!
  );
  const todo = data.documents;

  const columns = todo.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumns, Column>());

  const columntypes: TypedColumns[] = ["todo", "inprogress", "done"];
  for (const columntype of columntypes) {
    if (!columns.get(columntype)) {
      columns.set(columntype, {
        id: columntype,
        todos: [],
      });
    }
  }


  //sort
  const sortedColum = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columntypes.indexOf(a[0]) - columntypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColum,
  };
  return board;
};
