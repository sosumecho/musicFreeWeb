import {
    addToRecentlyPlaylist,
    setupRecentlyPlaylist,
} from '../core/recently-playlist';
import {TrackPlayerEvent} from '../core/track-player/enum';
import {setAutoFreeze} from 'immer';
import {registerPluginEvents} from '../core/plugin-delegate';
import MusicSheet from '../core/music-sheet';
import trackPlayer from '../core/track-player';
import {setupI18n} from '../i18n/render';
import Evt from '../core/events';

setAutoFreeze(false);

export default async function () {
    await Promise.all([
        // setupRendererAppConfig(),
        registerPluginEvents(),
        MusicSheet.frontend.setupMusicSheets(),
        trackPlayer.setupPlayer(),
    ]);
    // setupCommandHandler();
    // setupPlayerSyncHandler();
    // await setupI18n();
    // setupLocalShortCut();
    clearDefaultBehavior();
    setupEvents();
    setupDeviceChange();
    // localMusic.setupLocalMusic();
    // await Downloader.setupDownloader();
    setupRecentlyPlaylist();
}

function clearDefaultBehavior() {
    const killSpaceBar = function (evt: any) {
        // https://greasyfork.org/en/scripts/25035-disable-space-bar-scrolling/code
        const target = evt.target || {},
            isInput =
                'INPUT' == target.tagName ||
                'TEXTAREA' == target.tagName ||
                'SELECT' == target.tagName ||
                'EMBED' == target.tagName;

        // if we're an input or not a real target exit
        if (isInput || !target.tagName) return;

        // if we're a fake input like the comments exit
        if (
            target &&
            target.getAttribute &&
            target.getAttribute('role') === 'textbox'
        )
            return;

        // ignore the space
        if (evt.keyCode === 32) {
            evt.preventDefault();
        }
    };

    document.addEventListener('keydown', killSpaceBar, false);
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    })
}

/** 设置事件 */
function setupEvents() {

    Evt.on('TOGGLE_LIKE', async (item) => {
        // 如果没有传入，就是当前播放的歌曲
        const realItem = item || trackPlayer.getCurrentMusic();
        //@ts-ignore
        if (MusicSheet.frontend.isFavoriteMusic(realItem)) {
            MusicSheet.frontend.removeMusicFromFavorite(realItem);
        } else {
            MusicSheet.frontend.addMusicToFavorite(realItem);
        }
    });

    // 最近播放
    trackPlayer.on(TrackPlayerEvent.MusicChanged, (musicItem) => {
        if (musicItem) {
            addToRecentlyPlaylist(musicItem);
        }
    });
}

async function setupDeviceChange() {
    const getAudioDevices = async () =>
        await navigator.mediaDevices.enumerateDevices().catch(() => []);
    let devices = (await getAudioDevices()) || [];

    navigator.mediaDevices.ondevicechange = async (evt) => {
        const newDevices = await getAudioDevices();
        if (
            newDevices.length < devices.length
        ) {
            trackPlayer.pause();
        }
        devices = newDevices;
    };
}
