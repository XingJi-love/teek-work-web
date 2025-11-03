<script setup lang="ts" name="SqlForm">
import type { SqlLanguage, KeywordCase } from "sql-formatter";
import { format } from "sql-formatter";
import { oneDark } from "@codemirror/theme-one-dark";
import { sql } from "@codemirror/lang-sql";
import { CodeMirror, message } from "teek";
import { ServiceKey } from "@/common/config";
import { editService, generateCol } from "@/common/api/service";

const props = defineProps<{
  selectSql: string;
  tableNameList: string[];
  dataSourceId: string;
}>();

const serviceInfo = inject(ServiceKey, ref());
const disabled = computed(() => serviceInfo.value?.projectRole === "只读成员");

const model = reactive({
  selectSql: "",
  insertTable: "",
  updateTable: "",
  deleteTable: "",
});

watch(
  () => props.selectSql,
  () => {
    model.selectSql = props.selectSql;
  }
);

watch(
  () => serviceInfo.value,
  () => {
    model.selectSql = serviceInfo.value?.selectSql || "";
    model.insertTable = serviceInfo.value?.insertTable || "";
    model.updateTable = serviceInfo.value?.updateTable || "";
    model.deleteTable = serviceInfo.value?.deleteTable || "";
  }
);

/**
 * ElAutocomplete 查询回调
 */
const querySearch = (queryString: string, cb: any) => {
  const result = queryString
    ? props.tableNameList.filter(item => item.toLowerCase().includes(queryString.toLowerCase()))
    : props.tableNameList;

  cb(result.map(item => ({ value: item })));
};

const handleSave = async () => {
  if (!props.dataSourceId) return message.warning("数据源必选");
  const service = serviceInfo.value;
  if (!service) return message.warning("服务不存在");

  const { id } = service;

  const res = await editService({
    id,
    dataSourceId: props.dataSourceId,
    ...model.value,
    projectId: serviceInfo.value?.projectId,
  });
  if (res.code === 200) message.success("保存成功，4s 内无法再次点击");
};

const handleGenerateCol = async () => {
  if (!props.dataSourceId) return message.warning("数据源必选");
  const service = serviceInfo.value;
  if (!service) return message.warning("服务不存在");

  const { id } = service;

  const res = await generateCol({
    id,
    dataSourceId: props.dataSourceId,
    ...model.value,
    serviceId: serviceInfo.value?.serviceId || "",
    categoryId: serviceInfo.value?.categoryId || "",
    projectId: serviceInfo.value?.projectId || "",
    teamId: serviceInfo.value?.teamId || "",
  });
  serviceInfo.value!.exitCol = true;

  if (res.code === 200) message.success(res.message);
};

const formatterSql = (formatterRule: { language: SqlLanguage; lowerOrUpper: KeywordCase }) => {
  model.selectSql = format(model.selectSql, {
    language: formatterRule.language,
    keywordCase: formatterRule.lowerOrUpper,
    dataTypeCase: formatterRule.lowerOrUpper,
    functionCase: formatterRule.lowerOrUpper,
    identifierCase: formatterRule.lowerOrUpper,
  });
  message.success("SQL 格式化成功");
};

defineExpose({ model, formatterSql });
</script>

<template>
  <div class="flex card">
    <CodeMirror v-model="model.selectSql" :localTheme="oneDark" :lang="sql()" :height="500" fullScreen class="flex-1" />
    <el-form :model="model" label-width="100" class="w-[300px] ml-2.5">
      <el-form-item label="Insert Table">
        <el-autocomplete
          v-model="model.insertTable"
          :fetch-suggestions="querySearch"
          clearable
          placeholder="请输入表名"
          :trigger-on-focus="false"
        />
      </el-form-item>
      <el-form-item label="Update Table">
        <el-autocomplete
          v-model="model.updateTable"
          :fetch-suggestions="querySearch"
          clearable
          placeholder="请输入表名"
          :trigger-on-focus="false"
        />
      </el-form-item>
      <el-form-item label="Delete Table">
        <el-autocomplete
          v-model="model.deleteTable"
          :fetch-suggestions="querySearch"
          clearable
          placeholder="请输入表名"
          :trigger-on-focus="false"
        />
      </el-form-item>
      <el-button v-if="serviceInfo?.exitCol == false" type="primary" :disabled @click="handleGenerateCol">
        保存并生成列配置项
      </el-button>
      <el-button type="primary" :disabled v-throttle="{ onClick: handleSave, time: 4000 }">保 存</el-button>
    </el-form>
  </div>
</template>
