<script setup lang="ts" name="CircuitBreaking">
import { CodeMirror, message } from "teek";
import { oneDark } from "@codemirror/theme-one-dark";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { ServiceKey } from "@/common/config";
import { editService } from "@/common/api/service";

const serviceInfo = inject(ServiceKey, ref());

const jsonCode = ref("");

onMounted(() => {
  jsonCode.value = serviceInfo.value?.breakingRespond
    ? JSON.stringify(JSON.parse(serviceInfo.value?.breakingRespond!), null, "\t")
    : "";
});

const handleFormatterJson = () => {
  jsonCode.value = jsonCode.value ? JSON.stringify(JSON.parse(jsonCode.value), null, "\t") : "";
};

const handleSave = async () => {
  const service = serviceInfo.value;
  if (!service) return message.warning("服务不存在");

  const { id } = service;
  let breakingRespond;
  try {
    breakingRespond = JSON.parse(jsonCode.value);
  } catch {
    return message.error("JSON 格式错误");
  }

  const res = await editService({ id, breakingRespond, projectId: service.projectId });
  if (res.code === 200) message.success("保存成功");
};
</script>

<template>
  <el-space class="card w-full" fill>
    <div>
      <el-button :disabled="serviceInfo?.projectRole === '只读成员'" @click="handleFormatterJson">格式化</el-button>
      <el-button type="primary" @click="handleSave" :disabled="serviceInfo?.projectRole === '只读成员'">
        保 存
      </el-button>
    </div>
    <div>
      <CodeMirror
        v-model="jsonCode"
        :localTheme="oneDark"
        :lang="json()"
        :linter="jsonParseLinter()"
        :height="500"
        fullScreen
      />
    </div>
  </el-space>
</template>
