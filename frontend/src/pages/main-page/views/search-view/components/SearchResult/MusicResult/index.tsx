import React, { memo } from "react";
import useSearch from "../../../hooks/useSearch";
import {RequestStateCode} from '../../../../../../../common/constant';
import MusicList from '../../../../../../../components/MusicList';

interface IMediaResultProps {
  data: IMusic.IMusicItem[];
  state: RequestStateCode;
  pluginHash: string;
}

function MusicResult(props: IMediaResultProps) {
  const { data, state, pluginHash } = props;
  const search = useSearch();

  return (
    <MusicList
      doubleClickBehavior="normal"
      musicList={data}
      state={state}
      onPageChange={() => {
        search(undefined, undefined, "music", pluginHash);
      }}
      virtualProps={{
        fallbackRenderCount: -1
      }}
    ></MusicList>
  );
}

export default memo(
  MusicResult,
  (prev, curr) =>
    prev.data === curr.data &&
    prev.state === curr.state &&
    prev.pluginHash === curr.pluginHash
);
