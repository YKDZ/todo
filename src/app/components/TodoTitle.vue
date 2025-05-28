<script setup lang="ts">
import { useTodoStore } from "../stores/todo";
import { storeToRefs } from "pinia";
import ThemeSwictcher from "./ThemeSwictcher.vue";

const { uncompletedAmount } = storeToRefs(useTodoStore());
</script>

<template>
  <div class="flex items-center w-full gap-2">
    <ThemeSwictcher />
    <h3 class="inline-flex items-end gap-2">
      <span class="font-bold text-2xl text-highlight-content-darker">任务</span>
      <span v-if="uncompletedAmount > 0" class="text-highlight-content leading-none pb-0.8 text-xs"
        >{{ uncompletedAmount }} 个任务未完成...</span
      >
    </h3>
  </div>
</template>
