<script setup lang="tsx" name="UserInfo">
import type { TreeKey } from "element-plus";
import { TreeFilter, useNamespace } from "teek";
import { listDeptTreeList } from "@/common/api/system/dept";
import User from "../../user/index.vue";

const ns = useNamespace("user");

const initRequestParams = reactive({
  deptId: "",
});

const handleTreeChange = (nodeId: string | TreeKey[]) => {
  initRequestParams.deptId = nodeId + "";
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
      <User :init-request-params="initRequestParams" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@teek/styles/mixins/bem" as *;

@include b(user) {
  display: flex;

  .iconify {
    margin-right: 5px;
    vertical-align: -2px;
  }

  .user-table {
    display: flex;
    width: calc(100% - 230px);
    height: 100%;

    .tk-user {
      overflow: hidden;
    }

    :deep(.#{$el-namespace}-dialog__body) {
      margin-left: 20px;
    }
  }
}
</style>
