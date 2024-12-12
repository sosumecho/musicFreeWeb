import Condition from '../../../../components/Condition';
import NoPlugin from '../../../../components/NoPlugin';
import {Tab} from '@headlessui/react';
import {useNavigate} from 'react-router-dom';
import Body from './components/Body';
import {useEffect, useState} from 'react';
import {supportPlugins} from '../../../../api/api';
import {MusicPlugin} from '../../../../api/type';

export default function RecommendSheetsView() {
    const [availablePlugins, setAvailablePlugins] = useState<MusicPlugin[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        supportPlugins('getRecommendSheetsByTag').then(plugins => {
            setAvailablePlugins(plugins)
        })
    }, []);

    return (
        <div id="page-container" className="page-container">
            <Condition
                condition={availablePlugins.length}
                falsy={<NoPlugin supportMethod="热门歌单" height={'100%'}></NoPlugin>}
            >
                <Tab.Group
                    defaultIndex={history.state?.usr?.pluginIndex}
                    onChange={(index) => {
                        const usr = history.state.usr ?? {};

                        navigate('', {
                            replace: true,
                            state: {
                                ...usr,
                                pluginHash: availablePlugins[index].hash,
                                pluginIndex: index,
                                tag: null,
                            },
                        });
                    }}
                >
                    <Tab.List className="tab-list-container">
                        {availablePlugins.map((plugin: MusicPlugin) => (
                            <Tab key={plugin.hash} as="div" className="tab-list-item">
                                {plugin.instance.platform}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className={'tab-panels-container'}>
                        {availablePlugins.map((plugin: MusicPlugin) => (
                            <Tab.Panel className="tab-panel-container" key={plugin.hash}>
                                <Body plugin={plugin}></Body>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </Condition>
        </div>
    );
}
