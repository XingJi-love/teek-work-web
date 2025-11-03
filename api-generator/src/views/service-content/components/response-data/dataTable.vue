<script setup lang="ts" name="DataTable">
import type { TableColumn } from "teek";
import { ProPage } from "teek";

const props = defineProps<{ data: Record<string, any>[] }>();

const columns = computed<TableColumn[]>(() => {
  if (!props.data?.length) return [];
  const keys = Object.keys(props.data[0]);

  const columns: TableColumn[] = [];
  keys.forEach(item => {
    columns.push({
      prop: item,
      label: item,
      width: 200,
      sortable: true,
      filterConfig: {
        enabled: true,
      },
    });
  });
  return columns;
});
</script>

<template>
  <ProPage :columns :data />
</template>
