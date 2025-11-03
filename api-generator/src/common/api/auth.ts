import { http } from "@/common/http";

export namespace Auth {
  export interface LoginBody {
    tenantId: string;
    appId: string;
    username: string;
    password: string;
    grantType: string;
  }

  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expireIn: number;
    refreshExpireIn: number;
  }

  export interface TenantSelectList {
    tenantEnabled: boolean;
    tenantSelectList: TenantSelect[];
  }

  export interface TenantSelect {
    tenantId: string;
    tenantName: string;
    domain: string;
  }

  export interface LoginUserInfo {
    id: number;
    userId: string;
    username: string;
    nickname: string;
    email: string;
    phone: string;
    sex: number;
    avatar: string;
    loginIp: string;
    loginTime: string;
    registerTime: string;
  }
}

export const login = (loginBody: Auth.LoginBody) => {
  return http.post<httpNs.Response<Auth.LoginResponse>>("/auth/login", loginBody, { isEncrypt: true });
};

export const logout = () => {
  return http.post<httpNs.Response<string>>("/auth/logout");
};

export const getUserInfo = () => {
  return http.get<httpNs.Response<Auth.LoginUserInfo>>("/auth/getUserInfo");
};
