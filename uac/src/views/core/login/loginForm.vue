<script setup lang="ts" name="LoginForm">
import type { FormInstance } from "element-plus";
import type { Auth } from "@/common/api/auth";
import { ref, reactive, inject, useTemplateRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { User, Lock, WarnTriangleFilled, CircleClose, UserFilled, Histogram } from "@element-plus/icons-vue";
import { getTenantSelectList } from "@/common/api/auth";
import { serviceConfig, HOME_URL, uacAppSecret, uacAppGrantType } from "@/common/config";
import { getTimeState } from "@/common/utils";
import { ImageVerifyCode } from "@/components";
import { useNamespace } from "@/composables";
import { useUserStore } from "@/pinia";

interface LoginForm extends Auth.LoginBody {
  verifyCode: string;
}

const ns = useNamespace("login-form");

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const switchLoginMode = inject("switchLoginMode") as (mode: string) => void;

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verifyCode: [
    {
      validator: (_: any, value: string, callback: (e?: Error) => void) => {
        if (value === "") {
          callback(new Error("请输入验证码"));
        } else if (imgCode.value !== value) {
          callback(new Error("请输入正确的验证码"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const operates = [
  { title: "手机登录", mode: "phone" },
  { title: "注册登录", mode: "register" },
];

const thirdParty = [
  { title: "微信登录", icon: "login-wechat" },
  { title: "QQ登录", icon: "login-qq" },
  { title: "支付宝登录", icon: "login-alipay" },
  { title: "微博登录", icon: "login-weibo" },
];

const loginFormRef = useTemplateRef<FormInstance>("loginFormRef");

const imgCode = ref("");
const loading = ref(false);
const loginForm = reactive<LoginForm>({
  username: "k100338",
  password: "123456",
  verifyCode: "",
  tenantId: "",
  appId: uacAppSecret,
  grantType: uacAppGrantType,
});
const checked = ref(false);
const tenantSelect = ref<Auth.TenantSelect[]>([]);

const handleForgetPwd = () => {
  switchLoginMode("forget");
};

// 获取多租户下拉列表
const initTenantList = () => {
  getTenantSelectList().then(res => {
    tenantSelect.value = res.data.tenantSelectList;
    // 默认选择第一个租户 ID
    loginForm.tenantId = res.data.tenantSelectList[0].tenantId;
  });
};

const login = () => {
  loginFormRef.value?.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 执行登录
      const result = await userStore.login({ ...loginForm });
      if (!result) {
        ElNotification({
          title: getTimeState(),
          message: "登录失败，用户名或密码错误",
          type: "success",
          duration: 3000,
        });
        return;
      }

      // 跳转到首页或者 URL 携带的 redirect 页（优先级高）
      let path = HOME_URL;
      const { query } = route;

      if (query.redirect) path = query.redirect as string;

      const otherQuery = getOtherQuery(query);
      // otherQuery 不能是 {}，否则无法跳转
      if (Object.keys(otherQuery).length === 0) router.push(path);
      else router.push({ path, query: otherQuery });

      ElNotification.success({
        title: `欢迎登录 ${serviceConfig.layout.name}`,
        message: getTimeState(),
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  });
};

const getOtherQuery = (query: any) => {
  return Object.keys(query).reduce((acc: any, cur) => {
    if (cur !== "redirect") acc[cur] = query[cur];
    return acc;
  }, {});
};

const resetForm = () => {
  loginFormRef.value?.resetFields();
};

onMounted(initTenantList);
</script>

<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" :class="ns.b()">
    <el-form-item prop="tenantId">
      <el-select v-model="loginForm.tenantId" placeholder="租户">
        <template #prefix>
          <el-icon><Histogram /></el-icon>
        </template>
        <el-option v-for="item in tenantSelect" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" />
      </el-select>
    </el-form-item>

    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" @keydown.enter="login"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        placeholder="密码"
        show-password
        autocomplete="new-password"
        :prefix-icon="Lock"
        @keydown.enter="login"
      ></el-input>
    </el-form-item>

    <el-form-item prop="verifyCode">
      <el-input
        clearable
        v-model="loginForm.verifyCode"
        placeholder="验证码"
        :prefix-icon="WarnTriangleFilled"
        @keydown.enter="login"
      >
        <template #append>
          <ImageVerifyCode v-model="imgCode" />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <div :class="ns.e('item')" class="flx-align-center-between">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
        <el-button link type="primary" @click="handleForgetPwd">忘记密码?</el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <div :class="ns.e('btn')" class="flx-align-center-between">
        <el-button :icon="CircleClose" round @click="resetForm()" size="large">重置</el-button>
        <el-button :icon="UserFilled" round @click="login()" size="large" type="primary" :loading="loading">
          登录
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <div :class="ns.e('item')" class="flx-align-center-between">
        <el-button v-for="(item, index) in operates" :key="index" @click="switchLoginMode(item.mode)" size="default">
          {{ item.title }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-divider>第三方登录</el-divider>
      <div :class="ns.e('third-item')">
        <span v-for="(item, index) in thirdParty" :key="index" :title="item.title">
          <Icon :icon="item.icon" :size="20" />
        </span>
      </div>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
@use "./loginForm";
</style>
