<script setup lang="ts">
import Icon from "@/app/components/Icon.vue";
import { useCookies } from "@vueuse/integrations/useCookies.mjs";
import { storeToRefs } from "pinia";
import { useProfileStore } from "../stores/profile";

const props = defineProps<{
  completedAmount: number;
}>();

const cookies = useCookies(["isShowCompleted"]);

const { isShowCompleted } = storeToRefs(useProfileStore());

const handleChange = () => {
  isShowCompleted.value = !isShowCompleted.value;
  cookies.set("isShowCompleted", isShowCompleted.value);
};
</script>

<template>
  <span
    v-if="completedAmount > 0"
    class="text-sm text-highlight-content px-2 py-1 rounded-md bg-highlight-darker inline-flex gap-1 cursor-pointer select-none items-center justify-center"
    @click="handleChange"
    >已完成 <span class="text-xs">{{ completedAmount }}</span>
    <Icon small :icon="isShowCompleted ? 'i-mdi:chevron-up' : 'i-mdi:chevron-down'" />
  </span>
</template>
