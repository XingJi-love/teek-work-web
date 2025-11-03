<script setup lang="tsx" name="UserInfo">
import type { TreeKey } from "element-plus";
import type { DialogFormProps, ProPageInstance, TableColumn } from "teek";
import { TreeFilter, ProPage, useDialog, downloadByData, useNamespace } from "teek";
import { ElSwitch, ElInput, ElMessageBox } from "element-plus";
import { Key } from "@element-plus/icons-vue";
import { listDeptTreeList } from "@/common/api/system/dept";
import { addUser, editUser, removeUser, removeBatch, listPage, type User, exportExcel } from "@/common/api/user/user";
import { useDictStore } from "@/pinia";
import { useChange, usePermission } from "@/composables";
import { elFormProps, useFormColumns } from "./use-form-columns";

const ns = useNamespace("user");

const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");
const newPassword = ref("");

const { open } = useDialog();

const resetPassword = () => {
  open({
    title: "重置密码",
    onCancel: () => (newPassword.value = ""),
    onConfirm: handleConfirm,
    render: () => {
      return <ElInput v-model={newPassword.value} placeholder="请输入新密码"></ElInput>;
    },
  });
};

const handleConfirm = () => {
  if (!newPassword.value) {
    return;
  }
  // editOne({ id: row.id, userId: row.userId, password: newPassword.value }).then(() => {
  //   proPageInstance.value?.search();
  // });
};

const { statusChange } = useChange(
  "username",
  "用户",
  (row, status) => editUser({ id: row.id, userId: row.userId, status }),
  () => proPageInstance.value?.search()
);

const columns: TableColumn<User.UserInfo>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { prop: "username", label: "用户名称", width: 170, search: { el: "el-input" } },
  { prop: "nickname", label: "用户昵称", width: 170, search: { el: "el-input" } },
  { prop: "dept.deptName", label: "部门", width: 170, search: { el: "el-input" } },
  { prop: "phone", label: "手机号码", width: 130, search: { el: "el-input" } },
  { prop: "email", label: "邮箱", width: 170, search: { el: "el-input" } },
  {
    prop: "status",
    label: "状态",
    optionField: { value: "dictValue", label: "dictLabel" },
    options: () => useDictStore().getDictData("sys_normal_status"),
    search: { el: "el-select" },
    render: ({ row }) => {
      return (
        <>
          {row.status !== undefined && (
            <ElSwitch
              v-model={row.status}
              activeValue={1}
              inactiveValue={0}
              activeText="启用"
              inactiveText="停用"
              inlinePrompt
              onChange={value => statusChange(value, row)}
            />
          )}
        </>
      );
    },
  },
  { prop: "registerTime", width: 160, label: "注册时间" },
  { prop: "operation", label: "操作", width: 220, fixed: "right" },
];

const { hasAuth } = usePermission();

const dialogFormProps: DialogFormProps = {
  form: {
    elFormProps,
    columns: useFormColumns(computed(() => initRequestParams.deptId)).columns,
  },
  id: ["id", "userId"],
  addApi: addUser,
  editApi: editUser,
  editFilterKeys: ["dept", "disabled", "loginIp", "loginTime", "registerTime"],
  removeApi: removeUser,
  removeBatchApi: removeBatch,
  disableAdd: !hasAuth("system:user:add"),
  disableEdit: !hasAuth("system:user:edit"),
  disableRemove: !hasAuth("system:user:remove"),
  disableRemoveBatch: !hasAuth("system:user:remove"),
  dialog: {
    title: (_, status) => (status === "add" ? "新增" : "编辑"),
    width: "45%",
    height: 420,
    top: "5vh",
    closeOnClickModal: false,
  },
};

const initRequestParams = reactive({
  deptId: "",
});

const handleTreeChange = (nodeId: string | TreeKey[]) => {
  initRequestParams.deptId = nodeId + "";
};

const exportFile = (_: Record<string, any>[], searchParam: Record<string, any>) => {
  ElMessageBox.confirm("确认导出吗？", "温馨提示", { type: "warning" }).then(() => {
    exportExcel(searchParam).then(res => {
      downloadByData(res, `user_${new Date().getTime()}.xlsx`);
    });
  });
};
</script>

<template>
  <div :class="ns.b()">
    <TreeFilter :requestApi="listDeptTreeList" @change="handleTreeChange" id="value">
      <template #default="{ node }">
        <Icon v-if="node.data.icon" :icon="node.data.icon" class="inline-block"></Icon>
        <span>{{ node.label }}</span>
      </template>
    </TreeFilter>

    <div class="user-table">
      <ProPage
        ref="proPageInstance"
        :request-api="listPage"
        :columns
        :init-request-params="initRequestParams"
        :search-props="{ searchCols: { xs: 1, sm: 1, md: 2, lg: 3, xl: 3 } }"
        style="display: flex; flex-direction: column"
        :dialog-form-props
        :export-file
        :disabled-tool-button="!hasAuth('system:user:export') ? ['export'] : []"
      >
        <template #operation-after>
          <el-button v-auth="['system:user:passwordReset']" link size="small" :icon="Key" @click="resetPassword">
            重置密码
          </el-button>
        </template>
      </ProPage>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@teek/styles/mixins/bem" as *;

@include b(user) {
  display: flex;
  height: 100%;

  .iconify {
    margin-right: 5px;
    vertical-align: -2px;
  }

  .user-table {
    display: flex;
    width: calc(100% - 230px);
    height: 100%;

    :deep(.#{$el-namespace}-dialog__body) {
      margin-left: 20px;
    }
  }
}
</style>
