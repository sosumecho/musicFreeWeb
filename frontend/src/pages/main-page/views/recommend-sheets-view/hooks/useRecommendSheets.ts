import {RequestStateCode} from '../../../../../common/constant';
import {resetMediaItem} from '../../../../../common/media-util';
import {useCallback, useEffect, useRef, useState} from 'react';
import {MusicPlugin} from '../../../../../api/type';
import {getRecommendSheetByTag} from '../../../../../api/api';

export default function (plugin: MusicPlugin, tag: IMedia.IUnique | null) {
    const [sheets, setSheets] = useState<IMusic.IMusicSheetItem[]>([]);
    const [status, setStatus] = useState<RequestStateCode>(RequestStateCode.IDLE);
    const currentTagRef = useRef<string>();
    const pageRef = useRef(0);

    const query = useCallback(async () => {
        if (
            (RequestStateCode.PENDING_FIRST_PAGE & status ||
                RequestStateCode.FINISHED === status) &&
            currentTagRef.current === tag?.id
        ) {
            return;
        }
        if (currentTagRef.current !== tag?.id) {
            setSheets([]);
            pageRef.current = 0;
        }
        pageRef.current++;
        currentTagRef.current = tag?.id;

        setStatus(
            pageRef.current === 1
                ? RequestStateCode.PENDING_FIRST_PAGE
                : RequestStateCode.PENDING_REST_PAGE
        );
        console.log("tag", tag);
        const res = await getRecommendSheetByTag(plugin.hash, tag, pageRef.current)
        if (tag?.id === currentTagRef.current) {
            setSheets((prev) => [
                ...prev,
                ...res.data!.map((item: any) => resetMediaItem(item, plugin.instance.platform)),
            ]);
        }

        if (res.isEnd) {
            setStatus(RequestStateCode.FINISHED);
        } else {
            setStatus(RequestStateCode.PARTLY_DONE);
        }
    }, [tag, status]);

    useEffect(() => {
        if (tag) {
            query();
        }
    }, [tag]);

    return [query, sheets, status] as const;
}
