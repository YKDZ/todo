<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";
import { computed, ref } from "vue";

const props = defineProps<{
  keyString: string;
}>();

const keys = useMagicKeys();

const icons = ref([
  {
    key: "enter",
    icon: "i-fluent:arrow-enter-left-24-regular",
  },
  {
    key: "control",
    icon: "i-fluent:control-button-24-regular",
  },
  {
    key: "shift",
    icon: "i-fluent:keyboard-shift-24-regular",
  },
  {
    key: "t",
    icon: "i-mdi:alpha-t",
  },
  {
    key: "z",
    icon: "i-mdi:alpha-z",
  },
]);

const icon = computed(() => icons.value.find((icon) => icon.key === props.keyString.trim().toLowerCase())?.icon);

const key = computed(() => keys[props.keyString]);
</script>

<template>
  <div
    :class="{
      'bg-highlight-darker shadow-sm': !key.value,
      'bg-highlight-darkest shadow-lg scale-90': key.value,
    }"
    class="p-0.2 rounded-xs bg-op-60 inline-flex h-4 w-4 aspect-square items-center justify-center"
  >
    <span :class="icon" class="color-highlight-content h-full w-full" />
  </div>
</template>
