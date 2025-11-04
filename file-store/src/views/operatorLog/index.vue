<script setup lang="tsx" name="OperatorLog">
import type { ProPageInstance, PageColumn } from "@teek/components";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { ProPage, downloadByData } from "teek";
import { listPage, removeBatch, cleanAllLog, type OperaLog, exportExcel } from "@/common/api/operaLog";
import { useHandleData } from "@teek/composables";

const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");

const initRequestParams = reactive({
  orderRuleList: [{}],
});

const handleDeleteBatch = async (selectedListIds: string[]) => {
  useHandleData("删除所选信息?", async () => {
    removeBatch(selectedListIds)
      .then(res => {
        if (res.status === "success") {
          ElMessage.success("批量删除成功");
          proPageInstance.value?.clearSelection();
          proPageInstance.value?.search();
        } else {
          ElMessage.success("批量删除失败");
        }
      })
      .catch(err => {
        ElMessage.success("批量删除失败");
        console.log(err);
      });
  });
};

const handleClean = () => {
  useHandleData("清除全部信息?", async () => {
    cleanAllLog()
      .then(res => {
        if (res.status === "success") {
          ElMessage.success("清除日志成功");
          proPageInstance.value?.clearSelection();
          proPageInstance.value?.search();
        } else {
          ElMessage.success("清除日志失败");
        }
      })
      .catch(err => {
        ElMessage.success("清除日志失败");
        console.log(err);
      });
  });
};

const sortChange = (data: { column: any; prop: string; order: any }) => {
  initRequestParams.orderRuleList = [{ column: data.prop, type: data.order === "descending" ? "desc" : "asc" }];
};

const columns: PageColumn<OperaLog.OperaLogInfo>[] = [
  { type: "selection", fixed: "left", width: 80 },
  { prop: "operaId", label: "操作编号", width: 170 },
  { prop: "appId", label: "App ID", search: { el: "el-input" } },
  { prop: "fileKey", label: "附件标识", search: { el: "el-input" } },
  {
    prop: "operaType",
    label: "操作类型",
    width: 100,
    search: { el: "el-select" },
    options: [
      { value: 1, label: "上传" },
      { value: 2, label: "下载" },
      { value: 3, label: "预览" },
    ],
  },
  { prop: "operaUser", label: "操作人员", search: { el: "el-input" } },
  { prop: "operaIp", label: "操作 IP 地址", search: { el: "el-input" } },
  { prop: "operaLocation", label: "操作地点", search: { el: "el-input" } },
  {
    prop: "status",
    label: "状态",
    width: 100,
    tag: true,
    options: [
      { value: 0, label: "失败", tagEl: "el-check-tag", tagType: "danger" },
      { value: 1, label: "成功", tagEl: "el-check-tag", tagType: "success" },
    ],
    search: { el: "el-select" },
  },
  {
    prop: "createTime",
    label: "操作时间",
    sortable: "custom",
    search: {
      el: "el-date-picker",
      order: 3,
      props: { type: "daterange" },
    },
  },
  { prop: "costTime", label: "消耗时间/毫秒", search: { el: "el-input" } },
];

const exportFile = (_: Record<string, any>[], searchParam: Record<string, any>) => {
  useHandleData("确认导出吗？", () => {
    exportExcel(searchParam).then(res => {
      downloadByData(res, `operatorLog_${new Date().getTime()}.xlsx`);
    });
  });
};
</script>

<template>
  <ProPage
    ref="proPageInstance"
    :request-api="listPage"
    :init-request-params="initRequestParams"
    :columns
    :search-props="{
      searchCols: { xs: 1, sm: 1, md: 3, lg: 5, xl: 5 },
    }"
    @sort-change="sortChange"
    :default-sort="{ prop: 'createTime', order: 'descending' }"
    :export-file
    page-scope
  >
    <template #head-left="{ selectedListIds, isSelected }">
      <el-button type="danger" :icon="Delete" plain :disabled="!isSelected" @click="handleDeleteBatch(selectedListIds)">
        批量删除
      </el-button>
      <el-button type="danger" :icon="Delete" plain @click="handleClean()">清除</el-button>
    </template>
  </ProPage>
</template>
