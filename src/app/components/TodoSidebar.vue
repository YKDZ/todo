<script setup lang="ts">
import { trpc } from "@/server/trpc/client";
import { TodoDataSchema, type TodoData } from "@/shared/schema/misc";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useSidebarStore } from "../stores/sidebar";
import { useToastStore } from "../stores/toast";
import { useTodoStore } from "../stores/todo";
import Button from "./Button.vue";
import Sidebar from "./Sidebar.vue";
import Textarea from "./Textarea.vue";
import DropdownMenu from "./dropdown/DropdownMenu.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useDateFormat } from "@vueuse/core";

const { info, trpcWarn } = useToastStore();

const { isFree, isFolding } = storeToRefs(useSidebarStore());
const { currentTodo } = storeToRefs(useTodoStore());

const isProcessing = ref(false);
const mouseInSidebar = ref(false);
const { upsertTodos } = useTodoStore();

const text = ref<string>(currentTodo.value?.text ?? "");
const isCompleted = ref<boolean>(currentTodo.value?.isCompleted ?? false);
const isImportant = ref<boolean>(currentTodo.value?.isImportant ?? false);
const deadline = ref<Date | null>(null);

const handleImportant = async () => {
  if (!currentTodo.value) return;

  const newTodo = TodoDataSchema.parse({
    id: currentTodo.value.id,
    isImportant: !currentTodo.value.isImportant,
  });

  handleUpdate(newTodo);
};

const handleCompleted = async () => {
  if (!currentTodo.value) return;

  const newTodo = TodoDataSchema.parse({
    id: currentTodo.value.id,
    isCompleted: !currentTodo.value.isCompleted,
  });

  await handleUpdate(newTodo);
};

const handleChangeText = async () => {
  if (!currentTodo.value) return;

  const newTodo = TodoDataSchema.parse({
    id: currentTodo.value.id,
    text: text.value,
  });

  await handleUpdate(newTodo);
};

const handleChangeDeadline = async () => {
  if (!currentTodo.value) return;

  const newTodo = TodoDataSchema.parse({
    id: currentTodo.value.id,
    deadline: deadline.value ? new Date(deadline.value).toISOString() : null,
  });

  await handleUpdate(newTodo);
};

const handleUpdate = async (newTodo: TodoData) => {
  if (isProcessing.value) throw new Error("处理中");

  isProcessing.value = true;

  const oldTodo = currentTodo.value;

  await trpc.todo.update
    .mutate({ datas: [newTodo] })
    .then((todos) => {
      info("成功修改此任务");
      upsertTodos(todos[0]);
    })
    .catch((e) => {
      upsertTodos(oldTodo!);
      trpcWarn(e);
    })
    .finally(() => (isProcessing.value = false));
};

const handleDelete = async () => {
  if (!currentTodo.value) return;
  if (isProcessing.value) return;

  isProcessing.value = true;
  await trpc.todo.delete
    .mutate({ ids: [currentTodo.value.id] })
    .then(() => {
      info("成功删除此任务");
    })
    .catch(trpcWarn)
    .finally(() => (isProcessing.value = false));
};

const format = (date: Date) => {
  return useDateFormat(date, "dddd YYYY-MM-DD HH:mm:ss").value;
};

const deadlineToEndofXDayLater = (x: number) => {
  const now = new Date();
  deadline.value = new Date(now.getFullYear(), now.getMonth(), now.getDate() + x, 23, 59, 59, 999);
  handleChangeDeadline();
};

watch(
  currentTodo,
  (to) => {
    if (!to) isFree.value = true;
    else {
      text.value = to.text;
      isCompleted.value = to.isCompleted;
      isImportant.value = to.isImportant;
      deadline.value = to.deadline ? new Date(to.deadline) : null;
      isFree.value = false;
      isFolding.value = false;
    }
  },
  { immediate: true },
);

watch(
  isFolding,
  (to) => {
    if (!to && !currentTodo.value) isFolding.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <Sidebar v-model:mouse-in-sidebar="mouseInSidebar">
    <div class="flex flex-col h-full w-full justify-between">
      <div class="flex flex-col items-center">
        <!-- Top -->
        <div class="px-4.5 pt-5 flex gap-1 h-fit w-full select-none items-center justify-between">
          <Button
            transparent
            no-text
            :icon="isFree ? 'i-mdi:card-outline' : 'i-mdi:card-off-outline'"
            class="hidden md:flex"
            @click="isFree = !isFree"
          />
          <Button transparent no-text icon="i-mdi:close" class="flex md:hidden" @click="isFolding = !isFolding" />
        </div>
        <!-- Middle -->
        <div class="px-7 pt-6 flex flex-col gap-2 w-full">
          <Textarea v-model="text" full-width @change="handleChangeText" />
          <DropdownMenu v-if="!deadline">
            <template #trigger><Button full-width icon="i-mdi:star">添加截止日期</Button></template>
            <template #content
              ><div class="p-2 rounded-sm flex flex-col gap-2 w-full items-center">
                <Button
                  icon="i-mdi:clock-time-eight-outline"
                  full-width
                  transparent
                  @click="deadlineToEndofXDayLater(0)"
                  >今天</Button
                >
                <Button
                  icon="i-mdi:clock-time-eight-outline"
                  full-width
                  transparent
                  @click="deadlineToEndofXDayLater(3)"
                  >三天内</Button
                >
                <Button
                  icon="i-mdi:clock-time-eight-outline"
                  full-width
                  transparent
                  @click="deadlineToEndofXDayLater(7)"
                  >一周内</Button
                >
                <VueDatePicker
                  v-model="deadline"
                  :format
                  @cleared="handleChangeDeadline"
                  @update:model-value="handleChangeDeadline"
                />
              </div>
            </template>
          </DropdownMenu>
          <VueDatePicker
            v-else
            v-model="deadline"
            :format
            @cleared="handleChangeDeadline"
            @update:model-value="handleChangeDeadline"
          />
          <Button
            transparent
            full-width
            :icon="!isCompleted ? 'i-mdi:check' : 'i-mdi:close'"
            @click="handleCompleted"
            >{{ isCompleted ? "设为已完成" : "设为未完成" }}</Button
          >
          <Button
            transparent
            full-width
            :icon="!isImportant ? 'i-mdi:star' : 'i-mdi:star-off'"
            @click="handleImportant"
            >{{ isImportant ? "设为不重要" : "设为重要" }}</Button
          >
        </div>
      </div>
      <!-- Bottom -->
      <div class="px-4 flex h-14 w-full items-center justify-between">
        <div v-if="currentTodo" class="text-center w-full">
          创建于 {{ useDateFormat(currentTodo.createdAt, "YYYY-MM-DD") }}
        </div>
        <Button transparent icon="i-mdi:trash-can" small no-text @click="handleDelete" />
      </div>
    </div>
  </Sidebar>
</template>
