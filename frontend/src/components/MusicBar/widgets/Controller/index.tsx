import SvgAsset from '../../../../components/SvgAsset';
import './index.scss';
import trackPlayer from '../../../../core/track-player';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';

export default function Controller() {
    const playerState = trackPlayer.usePlayerState();

    const {t} = useTranslation();

    useEffect(() => {

        console.log('playerState: ', playerState)
    }, [playerState]);

    return (
        <div className="music-controller">
            <div className="skip controller-btn" title={t('music_bar.previous_music')!} onClick={() => {
                trackPlayer.skipToPrev();

            }}>
                <SvgAsset iconName="skip-left"></SvgAsset>
            </div>
            <div
                className="play-or-pause controller-btn primary-btn"
                onClick={() => {
                    if (playerState === trackPlayer.PlayerState.Playing) {
                        trackPlayer.pause();
                    } else {
                        trackPlayer.resumePlay();
                    }
                }}
            >
                <SvgAsset
                    iconName={
                        playerState !== trackPlayer.PlayerState.Playing ? 'play' : 'pause'
                    }
                ></SvgAsset>
            </div>
            <div
                className="skip controller-btn"
                title={t('music_bar.next_music')!}
                onClick={() => {

                    trackPlayer.skipToNext();
                }}
            >
                <SvgAsset iconName="skip-right"></SvgAsset>
            </div>
        </div>
    );
}
