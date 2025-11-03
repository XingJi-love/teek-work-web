import type { FormColumn } from "teek";
import { Icon, useDialog, ProForm, message } from "teek";
import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import { addTeam } from "@/common/api/team";
import { useUserStore } from "@/pinia";
import { useRouteFn } from "@/composables";

export const AddTeamMenu = () => {
  return (
    <div class="theme-color-hover" style="background: transparent;" onClick={openDialog}>
      <Icon icon={Plus} style={{ color: "inherit" }} />
      <span>新建团队</span>
    </div>
  );
};

interface TeamModel {
  teamName: string;
  description: string;
}

const openDialog = () => {
  const { open } = useDialog();

  const model = ref<TeamModel>({
    teamName: "",
    description: "",
  });

  const columns: FormColumn[] = [
    {
      prop: "teamName",
      label: "团队名称",
      el: "el-input",
      elProps: { placeholder: "请输入团队描述" },
      formItemProps: { rules: [{ required: true, message: "请输入 团队名称" }] },
    },
    {
      prop: "description",
      label: "团队描述",
      el: "el-input",
      elProps: { type: "textarea", placeholder: "请输入 团队描述" },
    },
  ];

  open({
    title: "新建团队",
    height: 170,
    onConfirm: () => handleConfirm(model.value),
    render: () => (
      <ProForm v-model={model.value} columns={columns} el-form-props={{ labelWidth: 80 }} showFooter={false} />
    ),
  });
};

const handleConfirm = async (model: TeamModel) => {
  const res = await addTeam(model);
  if (res.code === 200) {
    useRouteFn().initDynamicRoutes(useUserStore().roles);
    return message.success("团队新建成功");
  }
};
