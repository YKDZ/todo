<script setup lang="ts">
import CompletedTodoToggler from "@/app/components/CompletedTodoToggler.vue";
import TodoBatchTools from "@/app/components/TodoBatchTools.vue";
import TodoCreator from "@/app/components/TodoCreator.vue";
import TodoList from "@/app/components/TodoList.vue";
import TodoTitle from "@/app/components/TodoTitle.vue";
import { useProfileStore } from "@/app/stores/profile";
import { useTodoStore } from "@/app/stores/todo";
import { storeToRefs } from "pinia";

const { sortedCompletedTodos, sortedUncompletedTodos, completedAmount } = storeToRefs(useTodoStore());

const { isShowCompleted } = storeToRefs(useProfileStore());
</script>

<template>
  <div class="px-12 py-12 flex flex-col gap-2 h-full w-full items-center justify-between md:max-w-3/5">
    <div class="flex w-full items-center justify-between"><TodoTitle class="mb-2" /> <TodoBatchTools /></div>
    <div class="flex flex-col gap-1 h-full w-full items-start overflow-y-auto">
      <TodoList :todos="sortedUncompletedTodos" />
      <CompletedTodoToggler :completed-amount />
      <TodoList v-if="isShowCompleted" :todos="sortedCompletedTodos" class="op-60" />
    </div>
    <TodoCreator />
  </div>
</template>
