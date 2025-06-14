<script setup lang="ts">
import { useTodoStore } from "../stores/todo";
import { storeToRefs } from "pinia";
import ThemeSwictcher from "./ThemeSwictcher.vue";

const { uncompletedAmount } = storeToRefs(useTodoStore());
</script>

<template>
  <div class="flex gap-2 w-full items-center">
    <ThemeSwictcher />
    <h3 class="inline-flex gap-2 items-end">
      <span class="text-2xl text-highlight-content-darker font-bold">任务</span>
      <span v-if="uncompletedAmount > 0" class="text-xs text-highlight-content leading-none pb-0.8"
        >{{ uncompletedAmount }} 个任务未完成...</span
      >
    </h3>
  </div>
</template>
