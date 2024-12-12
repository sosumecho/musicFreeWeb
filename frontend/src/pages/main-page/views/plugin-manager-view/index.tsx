import {hideModal, showModal} from '../../../../components/Modal';
import PluginTable from './components/plugin-table';
import './index.scss';
import {getUserPreference} from '../../../../utils/user-perference';
// import { ipcRendererInvoke } from "@/shared/ipc/renderer";
import {toast} from 'react-toastify';
import A from '../../../../components/A';
import {Trans, useTranslation} from 'react-i18next';
import {installPlugins} from '../../../../api/api';
import {pluginStore} from './store/plugin';

export default function PluginManagerView() {
    const {t} = useTranslation();

    return (
        <div
            id="page-container"
            className="page-container plugin-manager-view-container"
        >
            <div className="header">
                {t('plugin_management_page.plugin_management')}
            </div>
            <div className="operation-area">
                <div className="left-part">
                    {/*<div*/}
                    {/*    role="button"*/}
                    {/*    data-type="normalButton"*/}
                    {/*    onClick={async () => {*/}

                    {/*    }}*/}
                    {/*>*/}
                    {/*    {t('plugin_management_page.install_from_local_file')}*/}
                    {/*</div>*/}
                    <div
                        role="button"
                        data-type="normalButton"
                        onClick={() => {
                            showModal('SimpleInputWithState', {
                                title: t('plugin_management_page.install_plugin_from_network'),
                                placeholder: t(
                                    'plugin_management_page.error_hint_plugin_should_end_with_js_or_json'
                                )!,
                                okText: t('plugin_management_page.install')!,
                                loadingText: t('plugin_management_page.installing')!,
                                withLoading: true,
                                async onOk(text) {
                                    if (
                                        text.trim().endsWith('.json') ||
                                        text.trim().endsWith('.js')
                                    ) {
                                        console.log('text is: ', text)
                                        return installPlugins(text)
                                        // return ipcRendererInvoke('install-plugin-remote', text);
                                    } else {
                                        throw new Error(
                                            t(
                                                'plugin_management_page.error_hint_plugin_should_end_with_js_or_json'
                                            )!
                                        );
                                    }
                                },
                                onPromiseResolved() {
                                    toast.success(
                                        t('plugin_management_page.install_successfully')
                                    );
                                    // 这里需要刷新本地插件列表
                                    pluginStore.setValue({
                                        needRefresh: true
                                    })
                                    hideModal();
                                },
                                onPromiseRejected(e) {
                                    toast.warn(
                                        `${t('plugin_management_page.install_failed')}: ${
                                            e.message ?? t('plugin_management_page.invalid_plugin')
                                        }`
                                    );
                                },
                                hints: [
                                    <Trans
                                        i18nKey={'plugin_management_page.info_hint_install_plugin'}
                                        components={{
                                            a: <A href="https://musicfree.upup.fun"></A>,
                                        }}
                                    ></Trans>,
                                ],
                            });
                        }}
                    >
                        {t('plugin_management_page.install_plugin_from_network')}
                    </div>
                </div>
                {/*<div className="right-part">*/}
                {/*    <div*/}
                {/*        role="button"*/}
                {/*        data-type="normalButton"*/}
                {/*        onClick={() => {*/}
                {/*            // showModal('PluginSubscription');*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {t('plugin_management_page.subscription_setting')}*/}
                {/*    </div>*/}
                {/*    <div*/}
                {/*        role="button"*/}
                {/*        data-type="normalButton"*/}
                {/*        onClick={async () => {*/}
                {/*            // const subscription = getUserPreference('subscription');*/}
                {/*            //*/}
                {/*            // if (subscription?.length) {*/}
                {/*            //     for (let i = 0; i < subscription.length; ++i) {*/}
                {/*            //         await ipcRendererInvoke(*/}
                {/*            //             'install-plugin-remote',*/}
                {/*            //             subscription[i].srcUrl*/}
                {/*            //         );*/}
                {/*            //     }*/}
                {/*            //     toast.success(t('plugin_management_page.update_successfully'));*/}
                {/*            // } else {*/}
                {/*            //     toast.warn(t('plugin_management_page.no_subscription'));*/}
                {/*            // }*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {t('plugin_management_page.update_subscription')}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <PluginTable></PluginTable>
        </div>
    );
}
