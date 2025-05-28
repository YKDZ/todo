import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore("profile", () => {
  const theme = ref("");
  const isShowCompleted = ref(false);

  const initInServer = (getCookie: (name: string) => string | null) => {
    isShowCompleted.value = getCookie("isShowCompleted") === "true";
    theme.value = getCookie("theme") ?? "";
  };

  return {
    theme,
    isShowCompleted,
    initInServer,
  };
});
