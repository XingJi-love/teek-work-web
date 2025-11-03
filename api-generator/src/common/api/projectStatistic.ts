import { http } from "@/common/http";

export declare namespace ProjectStatistic {
  interface ProjectStatisticInfo {
    serviceCount: number; // 服务数量
    categoryCount: number; // 目录数量
  }
}

const baseUri = "/projectStatistic";

export const getBaseProjectStatistic = (projectId: string) => {
  return http.get<httpNs.Response<ProjectStatistic.ProjectStatisticInfo>>(
    `${baseUri}/getBaseProjectStatistic/${projectId}`
  );
};
