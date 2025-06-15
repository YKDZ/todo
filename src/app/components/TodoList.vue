<script setup lang="ts">
import { useTodoStore } from "../stores/todo";
import TodoListItem from "./TodoListItem.vue";
import type { Todo } from "@/shared/schema/prisma";

const props = defineProps<{
  todos: Todo[];
}>();

const { upsertTodos, deleteTodos } = useTodoStore();

const handleUpdate = (todo: Todo) => {
  upsertTodos(todo);
};

const handleDelete = (id: number) => {
  deleteTodos(id);
};
</script>

<template>
  <ul class="flex flex-col gap-0.5 w-full overflow-visible">
    <TodoListItem v-for="todo in todos" :key="todo.id" :todo @update="handleUpdate" @delete="handleDelete" />
  </ul>
</template>
