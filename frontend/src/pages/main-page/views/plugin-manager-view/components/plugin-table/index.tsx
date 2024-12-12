import {
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import './index.scss';
import {CSSProperties, ReactNode, useEffect, useState} from 'react';
import Condition, {IfTruthy} from '../../../../../../components/Condition';
// import { hideModal, showModal } from "../../../../../../components/Modal";
import Empty from '../../../../../../components/Empty';
// import { ipcRendererInvoke } from "@/shared/ipc/renderer";
import {toast} from 'react-toastify';
import {showPanel} from '../../../../../../components/Panel';
// import DragReceiver, { startDrag } from "../../../../../../components/DragReceiver";
import {produce} from 'immer';
import {i18n} from '../../../../../../i18n/render';
import {getPlugins, uninstallPlugin} from '../../../../../../api/api';
import {MusicPlugin} from '../../../../../../api/type';
import {hideModal, showModal} from '../../../../../../components/Modal';
import {pluginStore} from '../../store/plugin';
// import {
//   getAppConfigPath,
//   setAppConfigPath,
// } from "@/shared/app-config/renderer";

const t = i18n.t;

function renderOptions(info: MusicPlugin) {
    const row = info

    return (
        <div>
            <ActionButton
                style={{
                    color: 'var(--dangerColor, #FC5F5F)',
                }}
                onClick={() => {
                    showModal('Reconfirm', {
                        title: t('plugin_management_page.uninstall_plugin'),
                        content: t('plugin_management_page.confirm_text_uninstall_plugin', {
                            plugin: row.instance.platform,
                        }),
                        async onConfirm() {
                            hideModal();
                            try {
                                await uninstallPlugin(row.hash)
                                pluginStore.setValue({
                                    needRefresh: true
                                })
                                toast.success(
                                    t('plugin_management_page.uninstall_successfully', {
                                        plugin: row.instance.platform,
                                    })
                                );
                            } catch {
                                toast.error(t('plugin_management_page.uninstall_failed'));
                            }
                        },
                    });
                }}
            >
                {t('plugin_management_page.uninstall')}
            </ActionButton>
            <Condition condition={row.instance.srcUrl}>
                <ActionButton
                    style={{
                        color: 'var(--successColor, #08A34C)',
                    }}
                    onClick={async () => {
                        try {
                            // await ipcRendererInvoke("install-plugin-remote", row.srcUrl);
                            toast.success(
                                t('plugin_management_page.toast_plugin_is_latest', {
                                    plugin: row.instance.platform,
                                })
                            );
                        } catch (e: any) {
                            toast.error(
                                e?.message ?? t('plugin_management_page.update_failed')
                            );
                        }
                    }}
                >
                    {t('plugin_management_page.update')}
                </ActionButton>
            </Condition>
        </div>
    );
}


export default function PluginTable() {
    const [plugins, setPlugins] = useState<MusicPlugin[]>([])
    const pluginValue= pluginStore.useValue()

    useEffect(() => {
        pluginStore.setValue({
            needRefresh: true
        })
    }, []);

    useEffect(() => {
        const {needRefresh} = pluginValue
        if (needRefresh) {
            reloadPlugin()
            pluginStore.setValue({
                needRefresh: false
            })
        }
    }, [pluginValue.needRefresh]);

    const reloadPlugin = () => {
        getPlugins().then(plugins => {
            setPlugins(plugins)
        })
    }

    return (
        <div className="plugin-table--container">
            <Condition
                condition={plugins.length}
                falsy={<Empty></Empty>}
            >
                <table>
                    <thead>
                    <tr>
                        <th style={{width: 64}}>#</th>
                        <th style={{width: 200}}>{t('media.media_platform')}</th>
                        <th style={{width: 100}}>{t('common.version_code')}</th>
                        <th style={{width: 100}}>{t('media.media_type_artist')}</th>
                        <th style={{width: '100%'}}>{t('common.operation')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plugins.map((row, index) => (
                        <tr key={row.hash}>
                            <td style={{
                                width: 64,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{index}</td>
                            <td style={{
                                width: 200,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{row.name}</td>
                            <td style={{
                                width: 100,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{row.instance.version}</td>
                            <td style={{
                                width: 100,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{row.instance.author}</td>
                            <td>
                                {renderOptions(row)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Condition>
        </div>
    );
}

interface IActionButtonProps {
    children: ReactNode;
    onClick?: () => void;
    style?: CSSProperties;
}

function ActionButton(props: IActionButtonProps) {
    const {children, onClick, style} = props;
    return (
        <span className="action-button" onClick={onClick} style={style}>
      {children}
    </span>
    );
}
