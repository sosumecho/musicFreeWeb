import {useCallback} from 'react';
import {hideModal} from '../..';
import SimpleInputWithState from '../SimpleInputWithState';
import {useTranslation} from 'react-i18next';
import debounce from '../../../../common/debounce';
import MusicSheet from '../../../../core/music-sheet';

interface IProps {
    initMusicItems: IMusic.IMusicItem | IMusic.IMusicItem[];
}

export default function AddNewSheet(props: IProps) {
    const {t} = useTranslation();

    const onCreateNewSheetClick = useCallback(
        debounce(async (newSheetName) => {
            try {
                const newSheet = await MusicSheet.frontend.addSheet(newSheetName);
                if (props?.initMusicItems) {
                    // @ts-ignore
                    await MusicSheet.frontend.addMusicToSheet(props.initMusicItems, newSheet.id);
                }
                hideModal();
            } catch {
                console.log('创建失败');
            }
        }, 500),
        []
    );

    return (
        <SimpleInputWithState
            title={t('modal.create_local_sheet')}
            onOk={onCreateNewSheetClick}
            placeholder={t('modal.create_local_sheet_placeholder')!}
            maxLength={30}
            okText={t('common.create')!}
        ></SimpleInputWithState>
    );
}
