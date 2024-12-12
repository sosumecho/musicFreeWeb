import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import MusicSheet, {defaultSheet} from '../../../../../core/music-sheet';
import MusicSheetlikeView from '../../../../../components/MusicSheetlikeView';

export default function LocalSheet() {
  const { id } = useParams() ?? {};
  const [musicSheet, loading] = MusicSheet.frontend.useMusicSheet(id!);
  const { t } = useTranslation();

  const _musicSheet =
    id === defaultSheet.id
      ? {
          ...musicSheet,
          title: t("media.default_favorite_sheet_name"),
        }
      : musicSheet;

  return (
    <MusicSheetlikeView
      hidePlatform
      //@ts-ignore
      musicSheet={_musicSheet}
      state={loading}
      musicList={musicSheet?.musicList ?? []}
    ></MusicSheetlikeView>
  );
}
