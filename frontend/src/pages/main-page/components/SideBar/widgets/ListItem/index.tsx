import SvgAsset, {SvgAssetIconNames} from '../../../../../../components/SvgAsset';
import './index.scss';
import {useEffect} from 'react';

interface IProps {
    selected?: boolean;
    onClick?: () => void;
    onContextMenu?: (...args: any) => void;
    iconName?: SvgAssetIconNames;
    title?: string;
}

export default function ListItem(props: IProps) {
    const {selected, onClick, iconName, title, onContextMenu} = props ?? {};

    // useEffect(() => {
    //     console.log('porps', props)
    // }, []);
    //
    return (
        <div
            onClick={onClick}
            onContextMenu={onContextMenu}
            title={title}
            role="button"
            className="side-bar--list-item-container"
            data-selected={selected}
        >
            {iconName ? <SvgAsset iconName={iconName}></SvgAsset> : null}
            <span>{title ?? ''}</span>
        </div>
    );
}
