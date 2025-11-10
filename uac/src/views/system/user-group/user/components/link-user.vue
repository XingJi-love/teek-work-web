<script setup lang="tsx">
import type { PageColumn } from "@teek/components";
import type { User } from "@/common/api/user/user";
import { ProPage, useNamespace } from "teek";
import { listUserLinkByGroupId } from "@/common/api/user/user";

const ns = useNamespace("user");

const props = defineProps<{ userGroupId: string }>();

const initRequestParams = reactive({ userGroupId: props.userGroupId });

// 监听 userGroupId，变化后修改关联的表格查询默认值
watchEffect(() => (initRequestParams.userGroupId = props.userGroupId));

const columns: PageColumn<User.UserInfo>[] = [
  { type: "selection", fixed: "left", width: 60 },
  { type: "index", label: "#", width: 60 },
  { prop: "username", label: "用户名称", search: { el: "el-input" } },
  { prop: "nickname", label: "用户昵称", search: { el: "el-input" } },
  { prop: "validFrom", width: 160, label: "起始日期" },
  { prop: "expireOn", width: 160, label: "失效日期" },
  { prop: "status", width: 160, label: "是否有效" },
  { prop: "createTime", width: 160, label: "注册时间" },
  { prop: "operation", label: "操作", width: 220, fixed: "right" },
];
</script>

<template>
  <div :class="ns.b()">
    <ProPage
      :request-api="listUserLinkByGroupId"
      :init-request-params
      :request-immediate="false"
      :columns
      :card="false"
    ></ProPage>
  </div>
</template>
