<script setup lang="ts" name="ServiceColBatchProps">
import type { FormColumn, ProFormInstance } from "teek";
import { ProForm } from "teek";
import { type ServiceCol } from "@/common/api/serviceCol";

interface ServiceColBatchProps {
  data: ServiceCol.ServiceColInfo[];
}

const props = defineProps<ServiceColBatchProps>();
const proFormInstance = useTemplateRef<ProFormInstance>("proFormInstance");

const operateType = ["添加", "更新", "请求"];

const model = reactive<ServiceCol.ServiceColUpdateBatch>({
  operateType: [],
  operateValue: "",
  jsonColList: [],
});

const columnList = ref<ServiceCol.ServiceColInfo[]>([]);

const handleFocus = () => {
  const { operateType, operateValue } = model;
  if (operateType.length && operateValue) {
    const ov = Number(operateValue);
    let data = props.data;
    operateType.forEach(item => {
      if (item === "添加") data = data.filter(d => d.allowInsert !== ov);
      else if (item === "更新") data = data.filter(d => d.allowUpdate !== ov);
      else if (item === "请求") data = data.filter(d => d.allowRequest !== ov);
    });
    columnList.value = data;
  }
};

const elFormProps = {
  labelWidth: 100,
  rules: {
    operateType: [{ required: true, message: "请选择操作类型", trigger: "blur" }],
    operateValue: [{ required: true, message: "请选择操作内容", trigger: "blur" }],
    jsonColList: [{ required: true, message: "请选择请求名称", trigger: "blur" }],
  },
};

const columns: FormColumn[] = [
  {
    prop: "operateType",
    label: "操作类型",
    el: "el-select",
    elProps: { multiple: true },
    options: operateType.map(item => ({ label: item, value: item })),
  },
  {
    prop: "operateValue",
    label: "操作内容",
    el: "el-select",
    options: [
      { label: "不允许", value: "0" },
      { label: "允许", value: "1" },
    ],
  },
  {
    prop: "jsonColList",
    label: "请求名称",
    el: "el-select",
    elProps: { multiple: true, onFocus: handleFocus },
    options: computed(() => columnList.value),
    optionField: { label: "jsonCol", value: "jsonCol" },
  },
];

const getData = async () => {
  const res = await proFormInstance.value?.elFormInstance?.validate();

  if (res) {
    const { operateType: op, operateValue: ov, jsonColList } = model;

    return {
      allowInsert: op.includes("添加") ? Number(ov) : null,
      allowUpdate: op.includes("更新") ? Number(ov) : null,
      allowRequest: op.includes("请求") ? Number(ov) : null,
      jsonColList,
    };
  }
};

defineExpose({ getData });
</script>

<template>
  <ProForm ref="proFormInstance" v-model="model" :columns :el-form-props :showFooter="false" />
</template>
