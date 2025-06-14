<script setup lang="ts">
import { storeToRefs } from "pinia";
import TodoSidebar from "../components/TodoSidebar.vue";
import { useSidebarStore } from "../stores/sidebar";
import Button from "../components/Button.vue";
import { useTodoStore } from "../stores/todo";

const { isFolding } = storeToRefs(useSidebarStore());
const { selectedTodoIds } = storeToRefs(useTodoStore());
</script>

<template>
  <div class="flex flex-col h-full w-full relative md:flex-row">
    <Button
      v-if="selectedTodoIds.length === 1"
      transparent
      no-text
      icon="i-mdi:menu"
      class="font-bold right-0 top-0 absolute md:hidden"
      @click="isFolding = !isFolding"
    />
    <div class="flex flex-col h-full w-full overflow-y-auto">
      <div class="flex flex-col gap-2 h-full w-full items-center">
        <slot />
      </div>
    </div>
    <TodoSidebar />
  </div>
</template>
