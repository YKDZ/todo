<script setup lang="ts">
import { computed, inject, ref, shallowRef, watch } from "vue";
import { schemaKey } from "..";
import JSONForm from "../JSONForm.vue";
import Button from "../../Button.vue";
import type { JSONSchema } from "zod/v4/core";
import type { JSONType } from "@/shared/schema/prisma";

const props = defineProps<{
  propertyKey?: string;
  data: JSONType[];
}>();

const emits = defineEmits<{
  (e: "_update", to: JSONType[]): void;
}>();

const schema = inject(schemaKey)!;
const count = ref(props.data.length);
const skipNextUpdate = ref(false);

const value = shallowRef<JSONType[]>(props.data);

const itemsSchema = computed(() => {
  // TODO 还可能是一个数组
  return (schema.items as JSONSchema.JSONSchema) ?? [];
});

const prefixItemsSchemas = computed(() => {
  return schema.prefixItems ? (schema.prefixItems as JSONSchema.JSONSchema[]) : [];
});

const handleUpdate = (to: JSONType, index: number) => {
  value.value.splice(index, 1, to);
  emits("_update", value.value);
};

const handleDelete = (index: number) => {
  count.value--;
  value.value = value.value.filter((_, i) => i !== index);
  emits("_update", value.value);
};

watch(
  () => props.data,
  (newData) => {
    skipNextUpdate.value = true;
    value.value = newData;
  },
);
</script>

<template>
  <Button no-text icon="i-mdi:plus" @click="count++" />
  <div v-for="index in count" :key="index">
    <Button no-text icon="i-mdi:trash-can" @click="handleDelete(index - 1)" />
    <JSONForm
      :schema="index > prefixItemsSchemas.length ? itemsSchema : prefixItemsSchemas[index]"
      :data="value[index - 1]"
      :property-key
      @update="(to) => handleUpdate(to, index - 1)"
    />
  </div>
</template>
