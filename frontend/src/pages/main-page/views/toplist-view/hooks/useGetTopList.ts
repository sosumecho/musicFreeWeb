import { produce } from "immer";
import { useCallback } from "react";
import { pluginsTopListStore } from "../store";
import { RequestStateCode } from "../../../../../common/constant";
import { useStore } from "../../../../../common/store";
import {getTopLists} from '../../../../../api/api';
// import { callPluginDelegateMethod } from "../../../../../core/plugin-delegate";

export default function useGetTopList() {
  const [pluginsTopList, setPluginsTopList] = useStore(pluginsTopListStore);

  const getTopList = useCallback(
    async (pluginHash: string) => {
      try {
        // 有数据/加载中直接返回
        if (
          pluginsTopList[pluginHash]?.data?.length ||
          pluginsTopList[pluginHash]?.state &
            RequestStateCode.PENDING_FIRST_PAGE
        ) {
          return;
        }

        setPluginsTopList(
          produce((draft: any) => {
            draft[pluginHash] = {
              state: RequestStateCode.PENDING_FIRST_PAGE,
              data: [],
            };
          })
        );
        const result = await getTopLists(pluginHash)
        setPluginsTopList(
          produce((draft: any) => {
            draft[pluginHash] = {
              data: result,
              state: RequestStateCode.FINISHED,
            };
          })
        );
      } catch {
        setPluginsTopList(
          produce((draft: any) => {
              draft[pluginHash].state = RequestStateCode.FINISHED;
          })
        );
      }
    },
    [pluginsTopList]
  );

  return getTopList;
}
