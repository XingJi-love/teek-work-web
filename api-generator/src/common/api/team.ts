import { http } from "@/common/http";

export declare namespace Team {
  export interface TeamMenu {
    teamId: string; // 团队 ID
    teamName: string; // 团队名字
    belongType: number; // 1 团队创建者 2 团队加入者
  }
  export interface TeamInfo {
    id: number; // 主键
    teamId: string; // 团队 ID
    teamName: string; // 团队名字
    description: string; // 团队介绍
    orderNum: string; // 显示顺序
  }

  export interface TeamRoute {
    id: number; // 主键
    teamId: string; // 团队 ID
    teamName: string; // 团队名字
    teamRole: number; // 团队角色
    belongType: number; // 1 团队创建者 2 团队加入者
  }

  type TeamSearch = Partial<TeamInfo>;
  type TeamInsert = RequiredKeyPartialOther<Omit<TeamInfo, "id" | "teamId">, "teamName">;
  type TeamUpdate = RequiredKeyPartialOther<TeamInfo, "id" | "teamName">;
  type TeamDelete = RequiredKeyPartialOther<TeamInfo, "teamId">;
}

const baseUri = "/team";

export const listMyAllTeamRoute = () => {
  return http.get<httpNs.Response<RouterConfigRaw[]>>(`${baseUri}/listMyAllTeamRoute`);
};

export const listMyAllTeam = () => {
  return http.get<httpNs.Response<Team.TeamRoute[]>>(`${baseUri}/listMyAllTeam`);
};

export const addTeam = (data: Team.TeamInsert) => {
  return http.post<httpNs.Response<Boolean>>(baseUri, data);
};

export const editTeam = (data: Team.TeamUpdate) => {
  return http.put<httpNs.Response<Boolean>>(baseUri, data);
};

export const removeTeam = (teamId: Team.TeamDelete) => {
  return http.delete<httpNs.Response<Boolean>>(`${baseUri}/${teamId}`);
};

/**
 * 移交团队负责人
 */
export const transferOwner = (data: { teamId: string; userId: string; username: string }) => {
  return http.post<httpNs.Response<Boolean>>(`${baseUri}/transferOwner/${data.teamId}/${data.userId}/${data.username}`);
};
