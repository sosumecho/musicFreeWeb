import {RequestStateCode} from '../../../../../../../common/constant';
import useSearch from '../../../hooks/useSearch';
import {useNavigate} from 'react-router-dom';
import ArtistItem from '../../../../../../../components/ArtistItem';
import BottomLoadingState from '../../../../../../../components/BottomLoadingState';


interface IMediaResultProps {
  data: IArtist.IArtistItem[];
  state: RequestStateCode;
  pluginHash: string;
}

export default function ArtistResult(props: IMediaResultProps) {
  const { data, state, pluginHash } = props;

  const search = useSearch();
  const navigate = useNavigate();

  return (
    <div className="search-result--artist-result-container">
      <div className="result-body">
        {data.map((artistItem, index) => {
          return <ArtistItem artistItem={artistItem} key={index} onClick={() => {
            navigate(
              {
                pathname: `/main/artist/${artistItem.platform}/${artistItem.id}`,
              },
              {
                state: {
                  artistItem
                },
              }
            );
          }}></ArtistItem>;
        })}
      </div>
      <BottomLoadingState
        state={state}
        onLoadMore={() => {
          search(undefined, undefined, "artist", pluginHash);
        }}
      ></BottomLoadingState>
    </div>
  );
}
