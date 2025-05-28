<script setup lang="ts">
import { useElementHover } from "@vueuse/core";
import { ref } from "vue";

const isChecked = defineModel<boolean>();

const checkboxEl = ref<HTMLDivElement>();

const isHovered = useElementHover(checkboxEl);
</script>

<template>
  <div ref="checkboxEl" class="flex pointer-events-none items-center justify-center hover:scale-110">
    <div class="relative inline-flex items-center pointer-events-none justify-center w-4 h-4">
      <input
        class="appearance-none absolute cursor-pointer pointer-events-auto inset-0 w-full h-full rounded-full border-1.5 border-base"
        type="checkbox"
        @click="isChecked = !isChecked"
      />
      <span
        class="absolute pointer-events-none color-base flex items-center justify-center w-full h-full w-3 h-3 scale-70 font-bold"
        :class="{
          'i-mdi:check': isChecked || isHovered,
        }"
      ></span>
    </div>
  </div>
</template>
