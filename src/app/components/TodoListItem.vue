<script setup lang="ts">
import { Todo } from "@/shared/schema/prisma";
import Icon from "./Icon.vue";
import { useElementHover, useFocus } from "@vueuse/core";
import { nextTick, ref, watch } from "vue";
import { trpc } from "@/server/trpc/client";
import { useToastStore } from "../stores/toast";
import Checkbox from "./Checkbox.vue";

const props = defineProps<{
  todo: Todo;
}>();

const { info } = useToastStore();

const containerEl = ref<HTMLLIElement>();
const inputEl = ref<HTMLInputElement>();

const isContainerHovered = useElementHover(containerEl);

const { focused } = useFocus(inputEl);

const isInputing = ref(false);
const isProcessing = ref<boolean>(false);

const todoData = ref({
  text: props.todo.text,
  isCompleted: props.todo.isCompleted,
});

const emits = defineEmits<{
  (e: "update", todo: Todo): void;
  (e: "delete", id: number): void;
}>();

const handleImportant = async () => {
  const newTodo = {
    ...props.todo,
    isImportant: !props.todo.isImportant,
  } satisfies Todo;

  handleUpdate(newTodo);
};

const handleCompleted = async () => {
  const newTodo = {
    ...props.todo,
    isCompleted: todoData.value.isCompleted,
  } satisfies Todo;

  handleUpdate(newTodo);
};

const handleChangeText = async () => {
  const newTodo = {
    ...props.todo,
    text: todoData.value.text,
  } satisfies Todo;

  await handleUpdate(newTodo)
    .then(() => {
      info("成功修改此任务");
    })
    .finally(() => (isInputing.value = false));
};

const handleUpdate = async (newTodo: Todo) => {
  if (isProcessing.value) return;

  isProcessing.value = true;

  const oldTodo = props.todo;

  await trpc.todo.update
    .mutate(newTodo)
    .then((todo) => {
      emits("update", todo);
    })
    .catch(() => {
      emits("update", oldTodo);
    })
    .finally(() => (isProcessing.value = false));
};

const handleDelete = async () => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  await trpc.todo.delete
    .mutate({ id: props.todo.id })
    .then(() => {
      info("成功删除此任务");
      emits("delete", props.todo.id);
    })
    .finally(() => (isProcessing.value = false));
};

const handleStartInput = async () => {
  isInputing.value = true;
  nextTick(() => (focused.value = true));
};

watch(
  () => props.todo,
  (to) => {
    todoData.value = { ...to };
  },
  { immediate: true },
);
</script>

<template>
  <li
    ref="containerEl"
    class="cursor-pointer overflow-x-hidden bg-highlight-darker text-highlight-content hover:bg-highlight-darkest rounded-md"
  >
    <div class="flex justify-between items-center gap-5 px-5 py-3">
      <Checkbox v-model="todoData.isCompleted" @change="handleCompleted" />
      <div class="w-full h-full relative">
        <span
          v-if="!isInputing"
          class="flex-1 min-w-0 whitespace-normal break-words text-highlight-content-darker"
          @click="handleStartInput"
        >
          {{ todo.text }}
        </span>
        <input
          v-if="isInputing"
          ref="inputEl"
          v-model="todoData.text"
          class="appearance-none w-full h-full text-highlight-content-darker focus:outline-base focus:outline-1 focus:outline-offset-3"
          type="text"
          @change="handleChangeText"
        />
      </div>
      <Icon
        v-show="todo.isImportant || isContainerHovered"
        small
        :icon="todo.isImportant ? 'i-mdi:star' : 'i-mdi:star-outline'"
        class="cursor-pointer hover:scale-110 color-base"
        @click="handleImportant"
      />
      <Icon v-show="!todo.isImportant && !isContainerHovered" small />
      <Icon
        v-show="isContainerHovered"
        small
        icon="i-mdi:trash-can"
        class="cursor-pointer hover:scale-110 color-red"
        @click="handleDelete"
      />
      <Icon v-show="!isContainerHovered" small />
    </div>
  </li>
</template>
