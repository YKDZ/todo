<script setup lang="ts">
const props = defineProps({
  fullWidth: Boolean,
});

const modalValue = defineModel({ type: String });
</script>

<template>
  <textarea
    v-model="modalValue"
    :class="{
      'md:max-w-2/3': !fullWidth,
      'w-full': fullWidth,
    }"
    class="text-highlight-content-darker p-3 outline-0 bg-highlight min-h-6rem select-none ring-1 ring-highlight-darkest ring-offset-transparent focus-visible:ring-base"
  />
</template>
