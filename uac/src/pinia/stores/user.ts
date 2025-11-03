import type { Auth } from "@/common/api/auth";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useRouteFn } from "@/composables";
import { resetRouter } from "@/router";
import { getUserInfo as doGetUserInfo, login as doLogin, logout as doLogout } from "@/common/api/auth";
import { useLayoutStore } from "./layout";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const accessToken = ref("");
    const refreshToken = ref("");

    const userInfo = ref<Partial<Auth.LoginUserInfo>>({});
    const roles = ref<string[]>([]);
    const searchHistory = ref<RouterConfig[]>([]);

    // 锁屏状态
    const isLock = ref(false);
    // 锁屏密码
    const lockPassword = ref("");

    const login = async (loginBody: Auth.LoginBody) => {
      const res = await doLogin(loginBody);
      const token = res.data.accessToken;
      setToken(token);
      return true;
    };

    const getUserInfo = async () => {
      const res = await doGetUserInfo();
      const roles = res.data.roles || ["admin"];
      setRoles(roles);
      setUserInfo(res.data.user);

      return { roles };
    };

    /**
     * 刷新 token
     */
    const doRefreshToken = async () => {
      return await new Promise<boolean>(resolve => {
        setTimeout(() => {
          const accessToken = "admin-token";
          const refreshToken = "admin-refresh-token";
          setToken(accessToken, refreshToken);
          resolve(true);
        }, 500);
      });
    };

    /**
     * 设置锁屏状态
     * @param status 锁屏状态
     */
    const setLockStatus = (status: boolean) => {
      isLock.value = status;
    };

    /**
     * 设置锁屏密码
     * @param password 锁屏密码
     */
    const setLockPassword = (password: string) => {
      lockPassword.value = password;
    };

    const logout = async () => {
      if (!accessToken.value) throw Error("LogOut: token is undefined!");
      await doLogout();
      // 重置锁屏状态
      isLock.value = false;
      // 清空锁屏密码
      lockPassword.value = "";
      userInfo.value = {};
      clearPermission();

      const layoutStore = useLayoutStore();
      layoutStore.removeAllTabs();
      layoutStore.setKeepAliveName();
      resetRouter();
    };

    const clearPermission = () => {
      setToken("", "");
      setRoles([]);
    };

    const changeRoles = async (rolesParam: string[]) => {
      // 模拟新的 token
      const accessToken = rolesParam[0] + "-token";
      setToken(accessToken);
      setRoles(rolesParam); // 正常不是直接赋予角色，而是调用 this.getUserInfo(token)，根据 token 重新获取对应的角色
      // await this.getUserInfo(token);
      resetRouter();
      useRouteFn().initDynamicRoutes(rolesParam);
    };

    const setToken = (newAccessToken: string, newRefreshToken?: string) => {
      accessToken.value = newAccessToken;
      if (newRefreshToken) {
        refreshToken.value = newRefreshToken;
      }
    };

    const setUserInfo = (userInfoParam: Auth.LoginUserInfo) => {
      userInfo.value = userInfoParam;
    };

    const setRoles = (rolesParam: string[]) => (roles.value = rolesParam);

    const setSearchHistory = (searchHistoryParam: RouterConfig[]) => (searchHistory.value = searchHistoryParam);

    return {
      lockPassword,
      accessToken,
      refreshToken,
      userInfo,
      roles,
      searchHistory,
      isLock,

      login,
      logout,
      getUserInfo,
      doRefreshToken,
      clearPermission,
      changeRoles,
      setUserInfo,
      setToken,
      setRoles,
      setSearchHistory,
      setLockStatus,
      setLockPassword,
    };
  },
  {
    persist: {
      pick: ["accessToken", "refreshToken", "searchHistory", "isLock", "lockPassword"],
    },
  }
);
