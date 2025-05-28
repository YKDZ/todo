<script setup lang="ts">
import "virtual:uno.css";
import Toast from "../components/Toast.vue";
import { onMounted } from "vue";
import { usePageContext } from "vike-vue/usePageContext";
import { useToastStore } from "../stores/toast";

const { userId, isFirst } = usePageContext();
const { info } = useToastStore();

onMounted(() => {
  if (isFirst) info(`欢迎 ${userId} 首次使用 TODO！你的任务列表与你的 ID 绑定。`);
  else info(`欢迎回来，${userId}！`);
});
</script>

<template>
  <div
    class="flex transition-colors duration-300 bg-highlight items-center justify-center max-w-screen max-h-screen w-screen h-screen overflow-hidden"
  >
    <slot />
    <Toast />
  </div>
</template>

<style>
@import url("../assets/theme.css");
</style>
