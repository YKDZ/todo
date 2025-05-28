import { PageContextServer } from "vike/types";
import { useProfileStore } from "../stores/profile";

export const guard = ({ pinia, getCookie }: PageContextServer) => {
  useProfileStore(pinia).initInServer(getCookie);
};
