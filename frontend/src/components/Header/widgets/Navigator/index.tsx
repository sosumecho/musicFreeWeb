import "./index.scss";
import { useTranslation } from "react-i18next";
import {useNavigate} from 'react-router-dom';
import {isMusicDetailShown} from '../../../MusicDetail';
import Evt from '../../../../core/events';
import SvgAsset from '../../../SvgAsset';

export default function HeaderNavigator() {
    const navigate = useNavigate();
    const canBack = history.state.idx > 0;
    const canGo = history.state.idx < history.length - 1;

    const {t} = useTranslation();


    return (
        <div className="header-navigator">
            <div
                className="navigator-btn"
                data-disabled={!canBack}
                title={canBack ? t("app_header.nav_back")! : ''}
                role="button"
                onClick={() => {
                    if (isMusicDetailShown()) {
                        Evt.emit("HIDE_MUSIC_DETAIL");
                    } else {
                        navigate(-1);
                    }
                }}
            >
                <SvgAsset iconName="chevron-left"></SvgAsset>
            </div>
            <div
                className="navigator-btn"
                data-disabled={!canGo}
                title={canGo ? t("app_header.nav_forward")! : ''}
                onClick={() => {
                    if (isMusicDetailShown()) {
                        Evt.emit("HIDE_MUSIC_DETAIL");
                    } else {
                        navigate(1);
                    }
                }}
            >
                <SvgAsset iconName="chevron-right"></SvgAsset>
            </div>
        </div>
    );
}
