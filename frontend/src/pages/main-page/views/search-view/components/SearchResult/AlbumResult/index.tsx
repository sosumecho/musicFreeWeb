import {RequestStateCode} from '../../../../../../../common/constant';
import useSearch from '../../../hooks/useSearch';
import {useNavigate} from 'react-router-dom';
import MusicSheetlikeList from '../../../../../../../components/MusicSheetlikeList';
import {memo} from 'react';

interface IMediaResultProps {
  data: IAlbum.IAlbumItem[];
  state: RequestStateCode;
  pluginHash: string;
}

function AlbumResult(props: IMediaResultProps) {
  const { data, state, pluginHash } = props;

  const search = useSearch();
  const navigate = useNavigate();

  return (
    <MusicSheetlikeList
      data={data}
      state={state}
      onLoadMore={() => {
        search(undefined, undefined, "album", pluginHash);
      }}
      onClick={(albumItem) => {
        navigate(`/main/album/${albumItem.platform}/${albumItem.id}`, {
          state: {
            albumItem,
          },
        });
      }}
    ></MusicSheetlikeList>
  );
}

export default memo(
  AlbumResult,
  (prev, curr) =>
    prev.data === curr.data &&
    prev.state === curr.state &&
    prev.pluginHash === curr.pluginHash
);
