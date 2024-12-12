import Store from '../../../../../common/store';

export interface IPlugin {
    needRefresh: boolean;
}

export const initPlugin: IPlugin = {
    needRefresh: false
}

const pluginStore = new Store(initPlugin);

export {pluginStore}
