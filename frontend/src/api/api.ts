import {MusicPlugin} from './type';

const baseURL = process.env.API_BASE_URL || ''


export const getPlugins = (): Promise<MusicPlugin[]> => {
    return fetch(`${baseURL}/plugins`).then(res => res.json())
}

export const installPlugins = (url: string) => {
    return fetch(`${baseURL}/plugins`, {
        method: 'POST',
        body: JSON.stringify({url}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}

export const uninstallPlugin = (hash: string) => {
    return fetch(`${baseURL}/plugin/${hash}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}

export const supportPlugins = (method: string): Promise<MusicPlugin[]> => {
    return fetch(`${baseURL}/plugins/support/${method}`).then(res => res.json())
}
export const searchablePlugins = (method: string): Promise<MusicPlugin[]> => {
    return fetch(`${baseURL}/plugins/searchable/${method}`).then(res => res.json())
}

export const getPluginByHash = (hash: string): Promise<MusicPlugin> => {
    return fetch(`${baseURL}/plugin/${hash}`).then(res => res.json())
}


export const getTopLists = (hash: string) => {
    return fetch(`${baseURL}/top?hash=${hash}`,).then(res => res.json())
}

export const getTopListDetail = (platform: string, item: any, page: number) => {
    return fetch(`${baseURL}/top/detail`, {
        method: 'POST',
        body: JSON.stringify({
            page: page.toString(),
            name: platform,
            data: JSON.stringify(item),
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}

export const getMusicSource = (musicItem: IMusic.IMusicItem, quality: IMusic.IQualityKey) => {
    return fetch(`${baseURL}/music`, {
        method: 'POST',
        body: JSON.stringify({
            quality,
            data: JSON.stringify(musicItem),
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}

export const searchMusic = (hash: string, query: string, page: number, type: string) => {
    return fetch(`${baseURL}/search`, {
        method: 'POST',
        body: JSON.stringify({
            query,
            hash,
            page: page.toString(),
            type,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
}

export const getRecommendSheetTags = (hash: string) => {
    return fetch(`${baseURL}/recommend/${hash}`).then(res => res.json())
}

export const getRecommendSheetByTag = (hash: string, tag: any, page: number) => {
    return fetch(`${baseURL}/recommend/${hash}/${JSON.stringify(tag)}?page=${page}`).then(res => res.json())
}

export const getMusicSheetInfo = (item: any, page: number) => {
    return fetch(`${baseURL}/music-sheet?item=${JSON.stringify(item)}&page=${page}`).then(res => res.json())
}
