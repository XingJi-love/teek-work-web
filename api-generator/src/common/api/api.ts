import { http } from "@/common/http";

const baseUri = "/generic-api";

export const pageByServiceId = (params: Record<string, any>) => {
  const serviceId = params.serviceId;
  delete params.serviceId;
  return http.get<httpNs.Response<Record<string, any>>[]>(`${baseUri}/pageByServiceId/${serviceId}`, params);
};

export const operateByServiceId = (data: Record<string, any>) => {
  const operateType = data.operateType;
  const serviceId = data.serviceId;
  delete data.operateType;
  delete data.serviceId;
  return http.post<httpNs.Response<Record<string, any>>[]>(`${baseUri}/operate/${operateType}/${serviceId}`, data);
};

export const exportExcel = (serviceId: string, params: Record<string, any>) => {
  return http.post<any>(`${baseUri}/export/${serviceId}`, params, { responseType: "blob" });
};
