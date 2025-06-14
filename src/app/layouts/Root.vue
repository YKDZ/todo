<script setup lang="ts">
import "virtual:uno.css";
import Toast from "../components/Toast.vue";
</script>

<template>
  <div
    class="bg-highlight flex h-screen max-h-screen max-w-screen w-screen transition-colors duration-300 items-center justify-center overflow-hidden"
  >
    <slot />
    <Toast />
  </div>
</template>

<style>
@import url("../assets/theme.css");
</style>
