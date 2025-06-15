<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTodoStore } from "../stores/todo";
import { trpc } from "@/server/trpc/client";
import Button from "./Button.vue";
import { useToastStore } from "../stores/toast";
import DropdownMenu from "./dropdown/DropdownMenu.vue";
import { TodoDataSchema, type TodoData } from "@/shared/schema/misc";
import { z } from "zod/v4";

const { selectedTodoIds, todos, isInMultiSelectMode } = storeToRefs(useTodoStore());
const { deleteTodos, upsertTodos } = useTodoStore();
const { info, trpcWarn } = useToastStore();

const handleBatchComplete = async () => {
  const datas = z.array(TodoDataSchema).parse(
    selectedTodoIds.value.map((id) => ({
      id,
      isCompleted: true,
    })),
  );

  await handleBatchUpdate(datas);
};

const handleBatchUncomplete = async () => {
  const datas = z.array(TodoDataSchema).parse(
    selectedTodoIds.value.map((id) => ({
      id,
      isCompleted: false,
    })),
  );

  await handleBatchUpdate(datas);
};

const handleBatchReverseCompleted = async () => {
  const datas = z.array(TodoDataSchema).parse(
    selectedTodoIds.value.map((id) => {
      const current = todos.value.find((todo) => id === todo.id);
      return {
        id,
        isCompleted: !current!.isCompleted,
      };
    }),
  );

  await handleBatchUpdate(datas);
};

const handleBatchImportant = async () => {
  const datas = z.array(TodoDataSchema).parse(
    selectedTodoIds.value.map((id) => ({
      id,
      isImportant: true,
    })),
  );

  await handleBatchUpdate(datas);
};

const handleBatchUnimportant = async () => {
  const datas = z.array(TodoDataSchema).parse(
    selectedTodoIds.value.map((id) => ({
      id,
      isImportant: false,
    })),
  );

  await handleBatchUpdate(datas);
};

const handleBatchReverseImportance = async () => {
  const datas = z.array(TodoDataSchema).parse(
    selectedTodoIds.value.map((id) => {
      const current = todos.value.find((todo) => id === todo.id);
      return {
        id,
        isImportant: !current!.isImportant,
      };
    }),
  );

  await handleBatchUpdate(datas);
};

const handleBatchUpdate = async (datas: TodoData[]) => {
  await trpc.todo.update
    .mutate({
      datas,
    })
    .then((todos) => {
      upsertTodos(...todos);
      info("成功修改所选任务");
    })
    .catch(trpcWarn);
};

const handleBatchDelete = async () => {
  await trpc.todo.delete
    .mutate({
      ids: selectedTodoIds.value,
    })
    .then(() => {
      deleteTodos(...selectedTodoIds.value);
      selectedTodoIds.value = [];
      info("成功删除所选的任务");
    })
    .catch(trpcWarn);
};
</script>

<template>
  <div class="flex gap-2 items-center">
    <Button
      v-if="selectedTodoIds.length !== todos.length && isInMultiSelectMode"
      transparent
      no-text
      icon="i-mdi:select-all"
      @click="selectedTodoIds = todos.map((todo) => todo.id)"
    />
    <Button
      v-if="selectedTodoIds.length > 0"
      transparent
      no-text
      icon="i-mdi:select-remove"
      @click="selectedTodoIds = []"
    />
    <DropdownMenu v-if="selectedTodoIds.length > 0">
      <template #trigger> <Button transparent icon="i-mdi:check-all" no-text /></template>
      <template #content>
        <div class="p-1">
          <Button transparent no-text icon="i-mdi:check" @click="handleBatchComplete" /><Button
            transparent
            no-text
            icon="i-mdi:close"
            @click="handleBatchUncomplete"
          /><Button no-text transparent icon="i-mdi:sync-circle" @click="handleBatchReverseCompleted" />
        </div>
      </template>
    </DropdownMenu>
    <DropdownMenu v-if="selectedTodoIds.length > 0">
      <template #trigger> <Button transparent icon="i-mdi:star" no-text /></template>
      <template #content>
        <div class="p-1">
          <Button transparent no-text icon="i-mdi:star" @click="handleBatchImportant" /><Button
            transparent
            no-text
            icon="i-mdi:star-off"
            @click="handleBatchUnimportant"
          /><Button no-text transparent icon="i-mdi:star-half-full" @click="handleBatchReverseImportance" />
        </div>
      </template>
    </DropdownMenu>
    <Button v-if="selectedTodoIds.length > 0" transparent icon="i-mdi:trash-can" no-text @click="handleBatchDelete" />
    <Button
      v-if="todos.length > 0"
      no-text
      transparent
      :icon="isInMultiSelectMode ? 'i-mdi:select-off' : 'i-mdi:select'"
      @click="isInMultiSelectMode = !isInMultiSelectMode"
    />
  </div>
</template>
