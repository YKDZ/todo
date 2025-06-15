<script setup lang="ts">
import { trpc } from "@/server/trpc/client";
import { TodoDataSchema, type TodoData } from "@/shared/schema/misc";
import type { Todo } from "@/shared/schema/prisma";
import { useElementHover, useFocus } from "@vueuse/core";
import { computed, nextTick, ref, watch } from "vue";
import { useToastStore } from "../stores/toast";
import { useTodoStore } from "../stores/todo";
import Checkbox from "./Checkbox.vue";
import Icon from "./Icon.vue";
import { storeToRefs } from "pinia";

const props = defineProps<{
  todo: Todo;
}>();

const { info, trpcWarn } = useToastStore();

const containerEl = ref<HTMLLIElement>();
const inputEl = ref<HTMLInputElement>();

const isContainerHovered = useElementHover(containerEl);
const { selectTodo } = useTodoStore();
const { selectedTodoIds, pickedTodoId, isInMultiSelectMode } = storeToRefs(useTodoStore());

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
  const newTodo = TodoDataSchema.parse({
    ...props.todo,
    isImportant: !props.todo.isImportant,
    deadline: undefined,
  });

  handleUpdate(newTodo);
};

const handleCompleted = async () => {
  const newTodo = TodoDataSchema.parse({
    ...props.todo,
    isCompleted: todoData.value.isCompleted,
    deadline: undefined,
  });

  handleUpdate(newTodo);
};

const handleChangeText = async () => {
  const newTodo = TodoDataSchema.parse({
    ...props.todo,
    text: todoData.value.text,
    deadline: undefined,
  });

  await handleUpdate(newTodo).finally(() => (isInputing.value = false));
};

const handleUpdate = async (newTodo: TodoData) => {
  if (isProcessing.value) return;

  isProcessing.value = true;

  const oldTodo = props.todo;

  await trpc.todo.update
    .mutate({ datas: [newTodo] })
    .then((todos) => {
      info("成功修改此任务");
      emits("update", todos[0]);
    })
    .catch((e) => {
      emits("update", oldTodo);
      trpcWarn(e);
    })
    .finally(() => (isProcessing.value = false));
};

const handleDelete = async () => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  await trpc.todo.delete
    .mutate({ ids: [props.todo.id] })
    .then(() => {
      info("成功删除此任务");
      emits("delete", props.todo.id);
    })
    .catch(trpcWarn)
    .finally(() => (isProcessing.value = false));
};

const handleStartInput = async () => {
  isInputing.value = true;
  nextTick(() => (focused.value = true));
};

const handleSelect = () => {
  if (!isInMultiSelectMode.value) pickedTodoId.value = props.todo.id;
  else selectTodo(props.todo.id);
};

const isSelected = computed(() => {
  return selectedTodoIds.value.findIndex((id) => id === props.todo.id) !== -1;
});

const remainHours = computed(() => {
  return new Date(props.todo.deadline as string).getTime() / 1000 / 60 / 60 - new Date().getTime() / 1000 / 60 / 60;
});

const deadlineAlertClasses = computed(() => {
  if (props.todo.isCompleted) return "color-gray";
  return remainHours.value < 0
    ? "color-red-900 animate-pulse"
    : remainHours.value < 1
      ? "color-red-800 animate-bounce"
      : remainHours.value < 3
        ? "color-red-700 animate-swing"
        : remainHours.value < 8
          ? "color-red-600"
          : remainHours.value < 24
            ? "color-red-500"
            : "color-red-400";
});

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
    class="text-highlight-content rounded-md bg-highlight-darker cursor-pointer relative overflow-visible hover:bg-highlight-darkest"
    :class="{
      'bg-highlight-darkest border-l-4 border-base': isSelected,
    }"
    @click="handleSelect"
  >
    <div class="px-5 py-3 flex gap-5 items-center justify-between">
      <Checkbox v-model="todoData.isCompleted" @change.stop="handleCompleted" />
      <div class="h-full w-full relative">
        <span
          v-if="!isInputing"
          class="text-highlight-content-darker flex-1 min-w-0 whitespace-normal break-words"
          :class="{
            'line-through': todo.isCompleted,
          }"
          @click.stop="handleStartInput"
        >
          {{ todo.text }}
        </span>
        <input
          v-if="isInputing"
          ref="inputEl"
          v-model="todoData.text"
          class="text-highlight-content-darker appearance-none h-full w-full focus:outline-1 focus:outline-base focus:outline-offset-3"
          type="text"
          @change="handleChangeText"
        />
      </div>
      <Icon
        v-show="todo.deadline"
        small
        :icon="
          !todo.isCompleted ? (remainHours < 0 ? 'i-mdi:clock-remove' : 'i-mdi:clock-alert') : 'i-mdi:clock-outline'
        "
        :class="deadlineAlertClasses"
      />
      <Icon
        v-show="todo.isImportant || isContainerHovered"
        small
        :icon="todo.isImportant ? 'i-mdi:star' : 'i-mdi:star-outline'"
        class="color-base cursor-pointer hover:scale-110"
        @click.stop="handleImportant"
      />
      <Icon v-show="!todo.isImportant && !isContainerHovered" small />
      <Icon
        v-show="isContainerHovered"
        small
        icon="i-mdi:trash-can"
        class="color-red cursor-pointer hover:scale-110"
        @click.stop="handleDelete"
      />
      <Icon v-show="!isContainerHovered" small />
    </div>
  </li>
</template>
