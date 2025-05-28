import { injectPiniaData } from "@/app/utils/pinia";
import { Data } from "./+data";
import { useTodoStore } from "@/app/stores/todo";

export const onData = injectPiniaData<Data>((pinia, { todos }) => {
  useTodoStore(pinia).initTodos(...todos);
});
