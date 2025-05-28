<script setup lang="ts">
import CompletedTodoToggler from "@/app/components/CompletedTodoToggler.vue";
import TodoCreator from "@/app/components/TodoCreator.vue";
import TodoList from "@/app/components/TodoList.vue";
import TodoTitle from "@/app/components/TodoTitle.vue";
import WhoAmI from "@/app/components/WhoAmI.vue";
import { useProfileStore } from "@/app/stores/profile";
import { useTodoStore } from "@/app/stores/todo";
import { storeToRefs } from "pinia";

const { sortedCompletedTodos, sortedUncompletedTodos, completedAmount } = storeToRefs(useTodoStore());

const { isShowCompleted } = storeToRefs(useProfileStore());
</script>

<template>
  <div class="flex flex-col justify-between items-center h-full w-full md:w-1/2 gap-2 px-10 py-10">
    <TodoTitle class="mb-2" />
    <div class="overflow-y-auto w-full h-full flex flex-col items-start gap-1">
      <TodoList :todos="sortedUncompletedTodos" />
      <CompletedTodoToggler :completed-amount />
      <TodoList v-if="isShowCompleted" :todos="sortedCompletedTodos" class="op-60" />
    </div>
    <TodoCreator />
    <WhoAmI />
  </div>
</template>
