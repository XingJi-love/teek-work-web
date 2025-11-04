<script setup lang="tsx" name="Members">
import type { TableColumn, FormColumn, ProPageInstance } from "teek";
import type { TeamMember } from "@/common/api/teamMember";
import type { User } from "@/common/api/user";
import type { ProjectRole } from "./project-member-role.vue";
import { ElButton } from "element-plus";
import { Setting, Plus } from "@element-plus/icons-vue";
import { ProPage, ProForm, PointTag, useNamespace, useDialog, message } from "teek";
import { editTeamMember, listMembersPage, inviteMembers, listMembers } from "@/common/api/teamMember";
import { listByKeyword } from "@/common/api/user";
import { useDictStore, useUserStore } from "@/pinia";
import ProjectMemberRole from "./project-member-role.vue";

const ns = useNamespace("members");

const { open } = useDialog();

const { getDictData } = useDictStore();

const route = useRoute();

const initRequestParams = { teamId: route.meta.params?.teamId };
const proPageInstance = useTemplateRef<ProPageInstance>("proPageInstance");

const teamRole = computed(() => route.meta.params?.teamRole);

const statusColor: Recordable = {
  0: "var(--el-color-info)",
  1: "var(--el-color-primary)",
};

const columns: TableColumn[] = [
  {
    prop: "userId",
    label: "成员 ID",
    isShow: false,
  },
  {
    prop: "username",
    label: "成员",
    search: {
      el: "el-input",
    },
  },
  {
    prop: "nickname",
    label: "团队内昵称",
    search: {
      el: "el-input",
    },
  },
  {
    prop: "status",
    label: "状态",
    options: () => getDictData("sys_normal_status"),
    optionField: { value: "dictValue", label: "dictLabel" },
    search: { el: "el-select" },
    render: ({ row, displayValue }) => <PointTag color={statusColor[row.status]}> {displayValue}</PointTag>,
  },
  {
    prop: "teamRole",
    label: "成员权限",
    tag: true,
    options: () => getDictData("team_role"),
    optionField: { value: "dictValue", label: "dictLabel" },
    search: {
      el: "el-select",
    },
  },
  {
    prop: "operation",
    label: "设置",
    render: ({ row }) => {
      return (
        <ElButton
          icon={Setting}
          link
          type="primary"
          onClick={() => handleSetting(row)}
          disabled={teamRole.value === "普通成员"}
        />
      );
    },
  },
];

const model = reactive<Record<string, any>>({});
const projectMemberList = ref<ProjectRole[]>([]);

const formColumns: FormColumn[] = [
  {
    prop: "username",
    label: computed(() => model.username),
    el: "el-divider",
  },
  {
    prop: "teamRole",
    label: "团队权限",
    el: "el-select",
    elProps: { disabled: computed(() => model.teamRole === "所有者") },
    options: () => getDictData("team_role"),
    optionField: { value: "dictValue", label: "dictLabel" },
    valueFormat: "string",
    formItemProps: { rules: [{ required: true, message: "请选择 团队权限" }] },
  },
  {
    prop: "nickname",
    label: "团队内昵称",
    el: "el-input",
  },
  {
    prop: "projectRoleDivider",
    label: "项目权限",
    el: "el-divider",
    elProps: {
      contentPosition: "left",
    },
  },
  {
    prop: "projectRole",
    label: "",
    render: () => <ProjectMemberRole userId={model.userId} onChange={handleProjectRoleChange} />,
  },
];

const handleSetting = (row: TeamMember.TeamMemberInfo) => {
  model.userId = row.userId;
  model.username = row.username;
  model.nickname = row.nickname;
  model.teamRole = row.teamRole;
  open({
    title: "设置成员角色",
    height: "auto",
    maxHeight: 700,
    onConfirm: settingConfirm,
    render: () => {
      return <ProForm v-model={model} columns={formColumns} cleanModel={false} showFooter={false} />;
    },
  });
};

const handleProjectRoleChange = (projectRole: ProjectRole[]) => {
  projectMemberList.value = projectRole;
};

const settingConfirm = async () => {
  const form = { ...model.value };

  delete form.username;
  delete form.projectRoleDivider;
  const data = {
    teamMember: { ...form, teamId: route.meta.params?.teamId },
    projectMemberList: projectMemberList.value,
  };
  const res = await editTeamMember(data as any);
  if (res.code === 200) {
    proPageInstance.value?.search();
    return message.success("修改成功");
  }
};

const memberInfo = ref<TeamMember.TeamMemberInfo[]>([]);
const loading = ref(false);
const optionList = ref<User.UserInfo[]>([]);
const memberInTeamInfo = ref<TeamMember.TeamMemberInfo[]>([]);
const handleInvite = async () => {
  if (!memberInTeamInfo.value.length) {
    // 获取成员信息
    const res = await listMembers({ teamId: route.meta.params?.teamId });
    if (res.code === 200) memberInTeamInfo.value = res.data;
  }
  open({
    title: "邀请成员",
    height: 200,
    onConfirm: inviteMemberList,
    render: () => {
      return (
        <el-select
          v-model={memberInfo.value}
          placeholder="请选择成员"
          multiple
          clearable
          filterable
          remote
          remote-method={remoteMethod}
          loading={loading.value}
          collapse-tags
          collapse-tags-tooltip
          max-collapse-tags={4}
        >
          {optionList.value.map(item => {
            const disabled = !!memberInTeamInfo.value.find(member => member.userId === item.userId);
            const label = item.nickname || item.username;
            return (
              <el-option
                label={label}
                value={{
                  userId: item.userId,
                  username: item.username,
                  nickname: item.nickname,
                  teamId: route.meta.params?.teamId,
                }}
                disabled={disabled}
              >
                {item.username} {item.nickname} {disabled ? "（已在团队内）" : ""}
              </el-option>
            );
          })}
        </el-select>
      );
    },
  });
};

const remoteMethod = async (keyword: string) => {
  if (keyword) {
    loading.value = true;
    const res = await listByKeyword(keyword);
    if (res.code === 200) optionList.value = res.data;
    loading.value = false;
  } else optionList.value = [];
};

const inviteMemberList = async () => {
  if (!memberInfo.value.length) {
    message.error("请选择成员");
    return false;
  }
  const res = await inviteMembers(memberInfo.value, useUserStore().userInfo.userId!);
  if (res.code === 200) {
    proPageInstance.value?.search();
    return message.success("邀请成功");
  }
  return message.error("邀请失败");
};
</script>

<template>
  <div :class="ns.b()">
    <ProPage
      ref="proPageInstance"
      :request-api="listMembersPage"
      :init-request-params
      :columns
      :search-props="{ searchCols: { xs: 1, sm: 1, md: 2, lg: 5, xl: 5 } }"
    >
      <template #tableHeader>
        <el-button type="primary" :icon="Plus" @click="handleInvite" :disabled="teamRole === '普通成员'">
          邀请成员
        </el-button>
      </template>
    </ProPage>
  </div>
</template>

<style lang="scss" scoped>
@use "@teek/styles/mixins/bem" as *;
@use "@teek/styles/mixins/namespace" as *;

@include b(members) {
  flex: 1;

  :deep(.#{$teek-namespace}-pro-search) {
    padding: 0;
    margin: 0;
    border: none;
    box-shadow: none;
  }

  :deep(.#{$teek-namespace}-pro-table) {
    padding: 0;
    border: none;
    box-shadow: none;
  }
}
</style>
