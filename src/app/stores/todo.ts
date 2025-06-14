import { trpc } from "@/server/trpc/client";
import type { Todo } from "@/shared/schema/prisma";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<Todo[]>([]);
  const selectedTodoIds = ref<number[]>([]);

  const currentTodo = computed<Todo | null>(() => {
    if (selectedTodoIds.value.length !== 1) return null;
    return todos.value.find((todo) => todo.id === selectedTodoIds.value[0]) ?? null;
  });

  const initTodos = (...todosInit: Todo[]) => {
    todos.value = todosInit;
  };

  const updateTodos = async () => {
    await trpc.todo.listOwned.query().then((tds) => {
      todos.value = tds;
    });
  };

  const deleteTodos = async (...ids: number[]) => {
    for (const id of ids) {
      todos.value.splice(
        todos.value.findIndex((todo) => todo.id === id),
        1,
      );
    }
  };

  const upsertTodos = (...todosToAdd: Todo[]) => {
    for (const todo of todosToAdd) {
      if (!todo) continue;

      const currentIndex = todos.value.findIndex((p) => p.id === todo.id);
      if (currentIndex === -1) {
        todos.value.unshift(todo);
      } else {
        todos.value.splice(currentIndex, 1, todo);
      }
    }
  };

  const sortedTodos = computed<Todo[]>(() => {
    return todos.value.sort((a, b) => {
      if (a.isImportant !== b.isImportant) {
        return a.isImportant ? -1 : 1;
      }
      const tA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : Date.parse(a.updatedAt);
      const tB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : Date.parse(b.updatedAt);

      return tB - tA;
    });
  });

  const sortedCompletedTodos = computed<Todo[]>(() => {
    return sortedTodos.value.filter((todo) => todo.isCompleted);
  });

  const sortedUncompletedTodos = computed<Todo[]>(() => {
    return sortedTodos.value.filter((todo) => !todo.isCompleted);
  });

  const uncompletedAmount = computed(() => {
    return todos.value.filter((todo) => !todo.isCompleted).length;
  });

  const completedAmount = computed(() => {
    return todos.value.filter((todo) => todo.isCompleted).length;
  });

  const selectTodo = (id: number) => {
    const index = selectedTodoIds.value.findIndex((i) => i === id);
    if (index === -1) selectedTodoIds.value.push(id);
    else selectedTodoIds.value.splice(index, 1);
  };

  return {
    todos,
    selectedTodoIds,
    sortedCompletedTodos,
    sortedUncompletedTodos,
    uncompletedAmount,
    completedAmount,
    currentTodo,
    deleteTodos,
    initTodos,
    upsertTodos,
    updateTodos,
    selectTodo,
  };
});
