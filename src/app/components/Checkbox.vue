<script setup lang="ts">
import { useElementHover } from "@vueuse/core";
import { ref } from "vue";

const isChecked = defineModel<boolean>();

const checkboxEl = ref<HTMLDivElement>();

const isHovered = useElementHover(checkboxEl);
</script>

<template>
  <div ref="checkboxEl" class="flex pointer-events-none items-center justify-center hover:scale-110">
    <div class="inline-flex h-4 w-4 pointer-events-none items-center justify-center relative">
      <input
        class="appearance-none border-1.5 border-base rounded-full h-full w-full cursor-pointer pointer-events-auto inset-0 absolute"
        type="checkbox"
        @click="isChecked = !isChecked"
      />
      <span
        class="color-base font-bold flex h-3 h-full w-3 w-full pointer-events-none scale-70 items-center justify-center absolute"
        :class="{
          'i-mdi:check': isChecked || isHovered,
        }"
      ></span>
    </div>
  </div>
</template>
