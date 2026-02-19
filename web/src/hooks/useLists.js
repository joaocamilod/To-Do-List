import { useTaskContext } from "../contexts/TaskContext";

export function useLists() {
  const ctx = useTaskContext();
  return {
    lists: ctx.lists,
    createList: ctx.createList,
    updateList: ctx.updateList,
    deleteList: ctx.deleteList,
    fetchLists: ctx.fetchLists,
  };
}
