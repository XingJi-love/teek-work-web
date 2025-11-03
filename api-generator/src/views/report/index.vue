<script setup lang="ts" name="Report">
import type { DialogFormProps, DialogFormColumn } from "teek";
import type { Report } from "@/common/api/report";
import { ProPage, downloadByData, useHandleData } from "teek";
import { listReportConfig } from "@/common/api/report";
import { pageByServiceId, operateByServiceId, exportExcel } from "@/common/api/api";

const route = useRoute();

const serviceId = computed(() => (route.params.serviceId as string) || "");
const reportName = computed(() => (route.params.reportName as string) || "");

const reportInfo = ref<Report.ReportInfo>();
const columns = ref<Record<string, any>[]>([]);
const formColumns = ref<DialogFormColumn[]>([]);

const initRequestParams = reactive({
  serviceId: serviceId.value,
});

const exportFile = (_: Record<string, any>[], searchParam: Record<string, any>) => {
  useHandleData("确认导出吗？", () => {
    exportExcel(serviceId.value, searchParam).then(res => {
      downloadByData(res, `${reportName.value}_${new Date().getTime()}.xlsx`);
    });
  });
};

const dialogFormProps = reactive<DialogFormProps>({
  form: {
    columns: computed(() => formColumns.value as any),
    cleanModel: false,
  },
  addApi: data => operateByServiceId({ ...data, operateType: "add", serviceId: serviceId.value }),
  editApi: data => operateByServiceId({ ...data, operateType: "edit", serviceId: serviceId.value }),
  removeApi: data => operateByServiceId({ ...data, operateType: "remove", serviceId: serviceId.value }),
  dialog: {
    title: (_, status) => (status === "add" ? "新增" : "编辑"),
    width: reportInfo.value?.dialogWidth || "50%",
    height: "auto",
    maxHeight: 500,
    top: "5vh",
    closeOnClickModal: false,
  },
});

onMounted(async () => {
  const res = await listReportConfig(serviceId.value);

  if (res.code === 200) {
    reportInfo.value = res.data.report;
    columns.value = res.data.proTableColumnsList.length
      ? [...res.data.proTableColumnsList, { prop: "operation", label: "操作", width: 160, fixed: "right" }]
      : [];
    formColumns.value = res.data.proFormSchemaList as DialogFormColumn[];
    dialogFormProps.disableAdd = reportInfo.value?.allowAdd === 0;
    dialogFormProps.disableEdit = reportInfo.value?.allowEdit === 0;
    dialogFormProps.disableRemove = reportInfo.value?.allowRemove === 0;
  }
});
</script>

<template>
  <ProPage
    v-if="reportInfo"
    :request-api="pageByServiceId"
    :init-request-params
    :columns
    :dialog-form-props
    :search-props="{ searchCols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 } }"
    :disabled-tool-button="reportInfo?.allowExport == 0 ? ['export'] : []"
    :pagination-props="{ pageSize: reportInfo?.pageSize || 20 }"
    :export-file
    class="p-3"
  />
</template>
