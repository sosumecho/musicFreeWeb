import {useEffect, useState, memo} from 'react';
import './index.scss';
import AlbumResult from './AlbumResult';
import MusicResult from './MusicResult';
import ArtistResult from './ArtistResult';
import {searchResultsStore} from '../../store/search-result';
import useSearch from '../../hooks/useSearch';
import {useNavigate} from 'react-router-dom';
import SheetResult from './SheetResult';
import {searchablePlugins} from '../../../../../../api/api';
import {MusicPlugin} from '../../../../../../api/type';
import Condition from '../../../../../../components/Condition';
import {RequestStateCode} from '../../../../../../common/constant';
import Loading from '../../../../../../components/Loading';
import SwitchCase from '../../../../../../components/SwitchCase';

interface ISearchResultProps {
    type: IMedia.SupportMediaType;
    query: string;
}

export default function SearchResult(props: ISearchResultProps) {
    const {type, query} = props;
    const [selectedPlugin, setSelectedPlugin] =
        useState<IPlugin.IPluginDelegate | null>(
            history.state?.usr?.plugin ?? null
        );

    const [plugins, setPlugins] = useState<MusicPlugin[]>([])


    useEffect(() => {
        searchablePlugins(type).then((plugins) => {
            setPlugins(plugins)
        })
    }, []);

    useEffect(() => {
        if (plugins.length && !selectedPlugin) {
            //@ts-ignore
            setSelectedPlugin(plugins[0]);
        }
    }, [plugins, selectedPlugin]);

    const navigate = useNavigate();

    return (
        <>
            <div className="search-view--plugins">
                {plugins?.map?.((plugin) => (
                    <div
                        className="plugin-item"
                        role="button"
                        key={plugin.hash}
                        onClick={() => {
                            //@ts-ignore
                            setSelectedPlugin(plugin);
                            const usr = history.state.usr ?? {};

                            // 获取history
                            navigate('', {
                                replace: true,
                                state: {
                                    ...usr,
                                    plugin: plugin,
                                },
                            });
                        }}
                        data-selected={selectedPlugin?.hash === plugin.hash}
                    >
                        {plugin.instance.platform}
                    </div>
                ))}
            </div>
            <SearchResultBody
                query={query}
                type={type}
                //@ts-ignore
                pluginHash={selectedPlugin?.hash}
            ></SearchResultBody>
        </>
    );
}

interface ISearchResultBodyProps {
    type: IMedia.SupportMediaType;
    pluginHash: string;
    query: string;
}

function _SearchResultBody(props: ISearchResultBodyProps) {
    const {type, pluginHash, query} = props;
    const searchResults = searchResultsStore.useValue();
    const currentResult = searchResults[type][pluginHash];
    const data = currentResult?.data ?? ([] as any[]);

    const search = useSearch();

    useEffect(() => {
        if (pluginHash && type && query) {
            search(query, 1, type, pluginHash);
        }
    }, [pluginHash, type, query]);

    return (
        <>
            <Condition
                condition={
                    currentResult?.state !== RequestStateCode.PENDING_FIRST_PAGE ||
                    !pluginHash
                }
                falsy={<Loading></Loading>}
            >
                <SwitchCase.Switch switch={type}>
                    <SwitchCase.Case case="music">
                        <MusicResult
                            //@ts-ignore
                            data={data}
                            state={currentResult?.state ?? RequestStateCode.IDLE}
                            pluginHash={pluginHash}
                        ></MusicResult>
                    </SwitchCase.Case>
                    <SwitchCase.Case case="album">
                        <AlbumResult
                            //@ts-ignore
                            data={data}
                            state={currentResult?.state ?? RequestStateCode.IDLE}
                            pluginHash={pluginHash}
                        ></AlbumResult>
                    </SwitchCase.Case>
                    <SwitchCase.Case case="artist">
                        <ArtistResult
                            //@ts-ignore
                            data={data}
                            state={currentResult?.state ?? RequestStateCode.IDLE}
                            pluginHash={pluginHash}
                        ></ArtistResult>
                    </SwitchCase.Case>
                    <SwitchCase.Case case="sheet">
                        <SheetResult
                            //@ts-ignore
                            data={data}
                            state={currentResult?.state ?? RequestStateCode.IDLE}
                            pluginHash={pluginHash}
                        ></SheetResult>
                    </SwitchCase.Case>
                </SwitchCase.Switch>
            </Condition>
        </>
    );
}

const SearchResultBody = memo(
    _SearchResultBody,
    (prev, curr) => prev.pluginHash === curr.pluginHash && prev.type === curr.type
);
