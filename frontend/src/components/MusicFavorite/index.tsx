import SvgAsset from "../SvgAsset";
import MusicSheet from '../../core/music-sheet';

interface IMusicFavoriteProps {
    musicItem: IMusic.IMusicItem;
    size: number;
}

export default function MusicFavorite(props: IMusicFavoriteProps) {
    const { musicItem, size } = props;
    const isFav = MusicSheet.frontend.useMusicIsFavorite(musicItem);

    return (
        <div
            role="button"
            onClick={(e) => {
                e.stopPropagation();
                //@ts-ignore
                if (isFav) {
                    MusicSheet.frontend.removeMusicFromFavorite(musicItem);
                } else {
                    MusicSheet.frontend.addMusicToFavorite(musicItem);
                }
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
            }}
            style={{
                //@ts-ignore
                color: isFav ? "red" : "var(--textColor)",
                width: size,
                height: size,
            }}
        >
            <SvgAsset
                //@ts-ignore
                iconName={isFav ? "heart" : "heart-outline"}
                size={size}
            ></SvgAsset>
        </div>
    );
}
