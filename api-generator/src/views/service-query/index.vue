<script setup lang="ts" name="ServiceQuery">
import { useNamespace, CodeMirror } from "teek";
import { http } from "@/common/http";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

const ns = useNamespace("service-query");

const code = ref("");

const route = useRoute();
const url = computed(() => import.meta.env.VITE_API_URL + route.query.query);

onMounted(async () => {
  const { query, secretKey } = route.query;
  const res = await http.get<httpNs.Response<Record<string, any>[]>>(`${query}?_limit=10`, { secretKey });
  if (res.code === 200) code.value = JSON.stringify(res.data, null, "\t");
});
</script>

<template>
  <el-space fill :class="ns.b()">
    <el-descriptions title="请求内容" border :column="1">
      <el-descriptions-item label="URL">{{ url }}</el-descriptions-item>
      <el-descriptions-item label="参数">?secretKey={{ route.query.secretKey }}</el-descriptions-item>
    </el-descriptions>

    <CodeMirror
      class="flex-1"
      v-model="code"
      :disabled="true"
      :localTheme="oneDark"
      :lang="json()"
      :linter="jsonParseLinter()"
      :height="800"
      fullScreen
    />
  </el-space>
</template>

<style lang="scss" scoped>
@use "@teek/styles/mixins/bem" as *;

@include b(service-query) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
}
</style>
