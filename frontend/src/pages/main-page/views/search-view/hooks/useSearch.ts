import {produce} from 'immer';
import {useCallback, useRef} from 'react';
import {searchResultsStore} from '../store/search-result';
import {getPluginByHash, searchMusic, supportPlugins} from '../../../../../api/api';
import {MusicPlugin} from '../../../../../api/type';
import {RequestStateCode} from '../../../../../common/constant';


export default function useSearch() {
    const searchResults = searchResultsStore.getValue();
    const setSearchResults = searchResultsStore.setValue;

    // 当前正在搜索
    const currentQueryRef = useRef<string>('');

    /**
     * query: 搜索词
     * queryPage: 搜索页码
     * type: 搜索类型
     * pluginHash: 搜索条件
     */
    const search = useCallback(
        async function (
            query?: string,
            queryPage?: number,
            type?: IMedia.SupportMediaType,
            pluginHash?: string
        ) {
            /** 如果没有指定插件，就用所有插件搜索 */

            let pluginDelegates: MusicPlugin[] = [];

            if (pluginHash) {
                const tgtPlugin = await getPluginByHash(pluginHash);
                tgtPlugin && (pluginDelegates = [tgtPlugin]);
            } else {
                pluginDelegates = await supportPlugins('search');
            }

            // 使用选中插件搜素
            for (const pluginDelegate of pluginDelegates) {
                const _platform = pluginDelegate.name;
                const _hash = pluginDelegate.hash;

                if (!_platform || !_hash) {
                    // 插件无效
                    continue;
                }

                const searchType = type ?? pluginDelegate.instance.supportedSearchType[0] ?? 'music';
                console.log('Search: ', query, searchType, _platform);

                // 上一份搜索结果
                const prevPluginResult = searchResults[searchType][pluginDelegate.hash];
                /** 上一份搜索还没返回/已经结束 */
                if (
                    (prevPluginResult?.state === RequestStateCode.PENDING_REST_PAGE ||
                        prevPluginResult?.state === RequestStateCode.FINISHED) &&
                    undefined === query
                ) {
                    continue;
                }

                // 是否是一次新的搜索
                const newSearch =
                    (query !== undefined && query !== prevPluginResult?.query) ||
                    prevPluginResult?.page === undefined;

                // 本次搜索关键词
                currentQueryRef.current = query =
                    query ?? prevPluginResult?.query ?? '';

                /** 搜索的页码 */
                const page =
                    queryPage ?? newSearch ? 1 : (prevPluginResult?.page ?? 0) + 1;

                if (
                    query === prevPluginResult?.query &&
                    //@ts-ignore
                    queryPage <= prevPluginResult?.page
                ) {
                    // 重复请求
                    continue;
                }

                try {
                    setSearchResults(
                        produce((draft) => {
                            const prevMediaResult: any = draft[searchType];
                            prevMediaResult[_hash] = {
                                state: newSearch
                                    ? RequestStateCode.PENDING_FIRST_PAGE
                                    : RequestStateCode.PENDING_REST_PAGE,
                                // @ts-ignore
                                data: newSearch ? [] : prevMediaResult[_hash]?.data ?? [],
                                query: query,
                                page,
                            };
                        })
                    );
                    const result = await searchMusic(pluginDelegate.hash, query, page, searchType);
                    console.log(
                        'SEARCH',
                        result,
                        query,
                        page,
                        searchType,
                        pluginDelegate.instance.platform
                    );
                    /** 如果搜索结果不是本次结果 */
                    if (currentQueryRef.current !== query) {
                        continue;
                    }
                    if (!result) {
                        throw new Error('搜索结果为空');
                    }
                    setSearchResults(
                        produce((draft) => {
                            const prevMediaResult = draft[searchType];
                            const prevPluginResult: any = prevMediaResult[_hash] ?? {
                                data: [],
                            };
                            const currResult = result.data ?? [];

                            prevMediaResult[_hash] = {
                                state:
                                    result?.isEnd === false && result?.data?.length
                                        ? RequestStateCode.PARTLY_DONE
                                        : RequestStateCode.FINISHED,
                                query,
                                page,
                                data: newSearch
                                    ? currResult
                                    : (prevPluginResult.data ?? []).concat(currResult),
                            };
                            return draft;
                        })
                    );
                } catch (e: any) {
                    setSearchResults(
                        produce((draft) => {
                            const prevMediaResult = draft[searchType];
                            const prevPluginResult =
                                prevMediaResult[_hash] ??
                                ({
                                    data: [] as any[],
                                } as any);

                            prevPluginResult.state =
                                page === 1
                                    ? RequestStateCode.FINISHED
                                    : RequestStateCode.PARTLY_DONE;
                            return draft;
                        })
                    );
                }
            }
        },
        [searchResults]
    );

    return search;
}
