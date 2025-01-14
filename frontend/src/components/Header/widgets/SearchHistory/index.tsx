
import "./index.scss";

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import SvgAsset from '../../../SvgAsset';
import Condition from '../../../Condition';
import Empty from '../../../Empty';
import {clearSearchHistory, getSearchHistory, removeSearchHistory} from '../../../../utils/search-history';

interface ISearchHistoryProps {
  onHistoryClick: (item: string) => void;
  onHistoryPanelFocus?: () => void;
  onHistoryPanelBlur?: () => void;
}

export default function SearchHistory(props: ISearchHistoryProps) {
  const { onHistoryClick, onHistoryPanelBlur, onHistoryPanelFocus } = props;
  const [historyList, removeHistory] = useSearchHistory();
  const {t} = useTranslation();


  return (
      <div
          className="search-history--container backdrop-color shadow"
          tabIndex={-1}
          onFocus={onHistoryPanelFocus}
          onBlur={onHistoryPanelBlur}
      >
        <div className="search-history--header">
          {t("app_header.search_history")}
          <div
              className="search-history--header-clear"
              role="button"
              onClick={() => {
                removeHistory();
              }}
          >
            <SvgAsset iconName="trash"></SvgAsset>
          </div>
        </div>
        <div className="search-history--body">
          <Condition
              condition={historyList?.length}
              falsy={
                <Empty
                    style={{
                      minHeight: "100px",
                    }}
                ></Empty>
              }
          >
            {historyList.map((historyItem) => (
                <div
                    className="search-history--item"
                    key={historyItem}
                    role="button"
                    data-type="normalButton"
                    onClick={() => {
                      onHistoryClick?.(historyItem);
                    }}
                >
                  {historyItem}
                  <div
                      className="search-history--item-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistory(historyItem);
                      }}
                  >
                    <SvgAsset iconName="x-mark"></SvgAsset>
                  </div>
                </div>
            ))}
          </Condition>
        </div>
      </div>
  );
}

function useSearchHistory() {
  const [historyList, setHistoryList] = useState<string[]>([]);

  function refreshHistoryList() {
    getSearchHistory().then((res) => {
      setHistoryList(res);
    });
  }

  useEffect(() => {
    refreshHistoryList();
  }, []);

  async function removeHistory(item?: string) {
    if (!item) {
      await clearSearchHistory();
    } else {
      await removeSearchHistory(item);
    }
    refreshHistoryList();
  }

  return [historyList, removeHistory] as const;
}
