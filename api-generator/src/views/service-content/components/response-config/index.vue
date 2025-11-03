<script setup lang="ts" name="ResponseConfig">
import { CodeMirror, message } from "teek";
import { oneDark } from "@codemirror/theme-one-dark";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { ServiceKey } from "@/common/config";
import { listByServiceId } from "@/common/api/serviceCol";
import { editService } from "@/common/api/service";

const serviceInfo = inject(ServiceKey, ref());
const jsonCode = ref("");

onMounted(async () => {
  if (!serviceInfo.value?.responseTemplate) return handleResetInit();
  jsonCode.value = serviceInfo.value?.responseTemplate!;
  handleFormatterJson();
});

const handleResetInit = async () => {
  const res = await listByServiceId(serviceInfo.value?.serviceId || "");
  jsonCode.value = `{"_root": [${res.data.map(item => `"${item.jsonCol}"`).join(`,`)}]}`;
  handleFormatterJson();
};
const handleFormatterJson = () => {
  jsonCode.value = jsonCode.value ? JSON.stringify(JSON.parse(jsonCode.value), null, "\t") : "";
};
const handleSave = async () => {
  const service = serviceInfo.value;
  if (!service) return message.warning("服务不存在");

  const { id } = service;
  let responseTemplate;
  try {
    responseTemplate = JSON.parse(jsonCode.value);
  } catch {
    return message.error("JSON 格式错误");
  }

  const res = await editService({ id, responseTemplate, projectId: service.projectId });
  if (res.code === 200) message.success("保存成功");
};
</script>

<template>
  <el-space class="card w-full" fill>
    <div>
      <el-button :disabled="serviceInfo?.projectRole === '只读成员'" @click="handleResetInit">还原初始化</el-button>
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
        :height="600"
        fullScreen
      />
    </div>
  </el-space>
</template>
