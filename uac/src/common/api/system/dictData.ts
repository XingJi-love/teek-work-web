import { http } from "@/common/http";

export namespace DictData {
  export interface DictDataInfo {
    id: number; // 主键
    dictId: string; // 字典 ID
    parentId: string; // 父级字典 ID
    dictLabel: string; // 字典标签
    dictValue: string; // 字典键值
    dictSort: number; // 字典排序
    tagEl: string; // tag 标签：el-tag | el-check-tag
    tagType: string; // tag 类型：primary | success | info | warning | danger
    tagEffect: string; // tag 主题：dark | light | plain
    tagAttributes: string; // tag 其他属性
    isDefault: string; // 是否默认（Y是 N否）
    appId: string; // 应用 ID
    dictCode: string; // 字典类型
    children: DictDataInfo[]; // 子数据
  }
}

const baseUri = "/system/dict/data";

export const list = (params: Partial<DictData.DictDataInfo>) => {
  return http.get<httpNs.Response<DictData.DictDataInfo[]>>(`${baseUri}/list`, params);
};

export const listPage = (params: Partial<DictData.DictDataInfo>) => {
  return http.get<httpNs.Page<DictData.DictDataInfo[]>>(`${baseUri}/listPage`, params);
};

export const listDataTreeList = (params: Partial<DictData.DictDataInfo>) => {
  return http.get<httpNs.Response<DictData.DictDataInfo[]>>(`${baseUri}/treeList`, params);
};

export const listDataTreeTable = (params: Partial<DictData.DictDataInfo>) => {
  return http.get<httpNs.Response<DictData.DictDataInfo[]>>(`${baseUri}/treeTable`, params);
};

export const addDictData = (data: DictData.DictDataInfo) => {
  return http.post<httpNs.Response<boolean>>(baseUri, data);
};

export const editDictData = (data: DictData.DictDataInfo) => {
  return http.put<httpNs.Response<boolean>>(baseUri, data);
};

export const removeDictData = (data: DictData.DictDataInfo) => {
  return http.delete<httpNs.Response<boolean>>(`${baseUri}/${data.id}`);
};

/**
 * 字典数据导出
 */
export const exportExcel = (params: Partial<DictData.DictDataInfo>) => {
  return http.post<any>(`${baseUri}/export`, params, { responseType: "blob" });
};
