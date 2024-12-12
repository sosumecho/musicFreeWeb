import {useCallback, useEffect, useState} from 'react';
import {MusicPlugin} from '../../../../../api/type';
import {getRecommendSheetTags} from '../../../../../api/api';

export default function (plugin: MusicPlugin) {
    const [tags, setTags] = useState<IPlugin.IGetRecommendSheetTagsResult | null>(
        null
    );

    const query = useCallback(async () => {
        try {
            const result = await getRecommendSheetTags(plugin.hash);
            if (!result) {
                throw new Error();
            }
            setTags(result);
        } catch {
            setTags({
                pinned: [],
                data: [],
            });
        }
    }, []);

    useEffect(() => {
        query();
    }, []);

    return tags;
}
