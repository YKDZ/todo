<script setup lang="ts">
import { onUpdated } from "vue";
import { useTodoStore } from "../stores/todo";
import TodoListItem from "./TodoListItem.vue";
import { Todo } from "@/shared/schema/prisma";

const props = defineProps<{
  todos: Todo[];
}>();

const { addTodos, deleteTodo } = useTodoStore();

const handleUpdate = (todo: Todo) => {
  addTodos(todo);
};

const handleDelete = (id: number) => {
  deleteTodo(id);
};
</script>

<template>
  <ul class="w-full gap-0.5 flex flex-col">
    <TodoListItem v-for="todo in todos" :key="todo.id" :todo @update="handleUpdate" @delete="handleDelete" />
  </ul>
</template>
