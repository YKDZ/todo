<script setup lang="ts">
import { ref } from "vue";
import Input from "./Input.vue";
import Button from "./Button.vue";
import { useTodoStore } from "../stores/todo";
import { trpc } from "@/server/trpc/client";
import { useToastStore } from "../stores/toast";

const { info, warn } = useToastStore();
const { upsertTodos } = useTodoStore();

const text = ref("");

const isProcessing = ref<boolean>(false);

const handleCreate = async () => {
  if (isProcessing.value) return;

  if (text.value.length === 0) {
    warn("任务不能为空");
    return;
  }

  isProcessing.value = true;
  await trpc.todo.create
    .mutate({
      text: text.value,
    })
    .then((todo) => {
      text.value = "";
      upsertTodos(todo);
      info("成功创建任务");
    })
    .finally(() => (isProcessing.value = false));
};
</script>

<template>
  <div class="flex gap-1 w-full items-center">
    <Input v-model="text" full-width icon="i-mdi:book" placeholder="任务内容" />
    <Button
      :is-processing
      icon="i-mdi:plus"
      magic-key="Control+Enter"
      @click="handleCreate"
      @magic-click="handleCreate"
    />
  </div>
</template>
