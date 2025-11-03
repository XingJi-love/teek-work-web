import { http } from "@/common/http";

const baseUri = "/download";

export const download = (appId: string, fileKey: string) => {
  return http.post<any>(`${baseUri}/${appId}/${fileKey}`, {}, { responseType: "blob" });
};
