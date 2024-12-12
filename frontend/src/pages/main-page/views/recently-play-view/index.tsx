import {useTranslation} from 'react-i18next';
import {clearRecentlyPlaylist, useRecentlyPlaylistSheet} from '../../../../core/recently-playlist';
import MusicSheetlikeView from '../../../../components/MusicSheetlikeView';
import SvgAsset from '../../../../components/SvgAsset';

export default function RecentlyPlayView() {
    const recentlyPlaylistSheet = useRecentlyPlaylistSheet();
    const {t} = useTranslation();

    const options = (
        <>
            <div
                role="button"
                className="option-button"
                data-type="normalButton"
                data-disabled={!recentlyPlaylistSheet.playCount}
                onClick={() => {
                    clearRecentlyPlaylist();
                }}
            >
                <SvgAsset iconName={'trash'}></SvgAsset>
                <span>{t('common.clear')}</span>
            </div>
        </>
    );

    return (
        <div id="page-container" className="page-container">
            <MusicSheetlikeView
                hidePlatform
                musicSheet={recentlyPlaylistSheet}
                musicList={recentlyPlaylistSheet.musicList}
                options={options}
            ></MusicSheetlikeView>
        </div>
    );
}
