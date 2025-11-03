import { http } from "@/common/http";

export namespace Profile {
  export interface ProfileInfo {
    id: number;
    nickname: string;
    phone: string;
    email: string;
    sex: number;
  }

  export interface ProfilePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
}

const baseUri = "/system/user/profile";

export const editProfile = (data: Profile.ProfileInfo) => {
  return http.put<httpNs.Response<boolean>>(baseUri, data);
};

export const updatePassword = (data: Profile.ProfilePassword) => {
  return http.put<httpNs.Response<boolean>>(`${baseUri}/updatePassword`, data);
};
