<script setup lang="ts">
import { trpc } from "@/server/trpc/client";
import { usePageContext } from "vike-vue/usePageContext";
import { reload } from "vike/client/router";
import { computed, ref, watch } from "vue";
import { useToastStore } from "../stores/toast";
import { useTodoStore } from "../stores/todo";
import Button from "./Button.vue";
import Input from "./Input.vue";

const ctx = usePageContext();

const { info, warn } = useToastStore();
const { updateTodos } = useTodoStore();

const userId = ref(ctx.userId ?? "");

const isSame = computed(() => userId.value === ctx.userId);
const isProcessing = ref<boolean>(false);

const handleWhoAmI = async () => {
  if (isProcessing.value) return;
  if (isSame.value) return;

  isProcessing.value = true;
  await trpc.user.whoAmI
    .query({ id: userId.value })
    .then(() => {
      info(`你好，${userId.value}!`);
      updateTodos(userId.value);
    })
    .catch(async () => {
      warn(`我不认识 ${userId.value} :(`);
      userId.value = ctx.userId!;
    })
    .finally(() => (isProcessing.value = false));
};

const handleDelete = async () => {
  await trpc.user.delete.mutate().then(async () => {
    info(`再见，${userId.value}！`);
    useTodoStore().todos = [];
    const user = await trpc.user.askNew.mutate();
    await reload();
    info(`初次见面，${user.id}！`);
  });
};

watch(
  () => ctx.userId,
  (to) => (userId.value = to ?? ""),
  { immediate: true },
);
</script>

<template>
  <div class="flex gap-1 items-center w-full">
    <Input v-model="userId" icon="i-mdi:account" full-width type="text" placeholder="你的 ID" />
    <Button :is-processing no-text icon="i-mdi:earth" :disabled="isSame" @click="handleWhoAmI" />
    <Button :is-processing no-text icon="i-mdi:trash-can" @click="handleDelete" />
  </div>
</template>
