<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import { storeToRefs } from "pinia";
import { useProfileStore } from "../stores/profile";
import Icon from "./Icon.vue";

const cookies = useCookies(["theme"]);

const { theme } = storeToRefs(useProfileStore());

const handleChange = () => {
  theme.value = theme.value === "" ? "dark" : "";
  cookies.set("theme", theme.value);
  document.documentElement.setAttribute("data-theme", theme.value);
};
</script>

<template>
  <Icon
    :icon="theme === 'dark' ? 'i-mdi:lightbulb' : 'i-mdi:lightbulb-on'"
    class="color-highlight-content-darker cursor-pointer hover:scale-110"
    @click="handleChange"
  />
</template>
