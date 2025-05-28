import { storeToRefs } from "pinia";
import { useProfileStore } from "../stores/profile";
import { PageContextServer } from "vike/types";

export const data = ({ getCookie, pinia }: PageContextServer) => {
  console.log("yes");
  const { isShowCompleted, theme } = storeToRefs(useProfileStore(pinia!));
  isShowCompleted.value = getCookie("isShowCompleted") === "true";
  theme.value = getCookie("theme") ?? "";
};
