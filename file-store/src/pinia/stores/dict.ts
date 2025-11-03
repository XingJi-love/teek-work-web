import type { DictData } from "@/common/api/dictData";
import { ref } from "vue";
import { defineStore } from "pinia";
import { list, listDataTreeList } from "@/common/api/dictData";

export interface Dict {
  [key: string]: DictData.DictDataInfo[];
}

export const useDictStore = defineStore("dictStore", () => {
  const dictList = ref<Dict>({});

  /**
   * 查询字典数据，isCascade为 true 时，代表开启级联查询，返回树形数据
   */
  const getDictData = async (dictCode: string, isCascade = false) => {
    if (dictList.value[dictCode]) return { data: dictList.value[dictCode] };
    const res = isCascade ? await listDataTreeList({ dictCode }) : await list({ dictCode });

    dictList.value[dictCode] = res.data;
    return res;
  };

  return {
    getDictData,
  };
});
