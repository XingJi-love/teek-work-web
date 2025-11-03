import { http } from "@/common/http";

export declare namespace App {
  interface AppInfo {
    appId: string; // 应用 ID
    appName: string; // 应用名称
    owner: string; // 负责人 ID
    email: string; // 邮箱
    phone: string; // 手机号码
    failedSm: number; // 失败短信提醒（0 不发送 1 发送）
    failedEm: string; // 失败信息邮件通知（0 不发送 1 发送）
    remark: string; // 备注
    status: number; // 状态（0 异常 1 正常）
    createTime: string; // 创建时间
  }
}

const baseUri = "/app";

export const listAppPage = (params?: Partial<App.AppInfo>) => {
  return http.get<httpNs.Response<App.AppInfo[]>>(`${baseUri}/listPage`, params);
};

export const registerApp = (data: Partial<App.AppInfo>) => {
  return http.post<httpNs.Response<Boolean>>(baseUri, data);
};

export const editApp = (data: Partial<App.AppInfo>) => {
  return http.put<httpNs.Response<boolean>>(baseUri, data);
};

export const removeApp = (data: App.AppInfo) => {
  return http.delete<httpNs.Response<boolean>>(`${baseUri}/${data.appId}`);
};
