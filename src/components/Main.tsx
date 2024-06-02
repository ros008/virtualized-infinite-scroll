import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VariableSizeList as List, ScrollDirection } from "react-window";
import * as S from "./styled";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCoreStore } from "../stores/CoreProvider";
import { observer } from "mobx-react-lite";
import Row from "./Row";

const MessageList = observer(
  ({ width, height }: { width: number; height: number }) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [key: number]: number }>({});
    const isUpDirection = useRef(false);

    const [isFirstRender, setIsFirstRender] = useState(true);
    const [startIndex, setStartIndex] = useState<number>(0);

    const { dataStore } = useCoreStore();

    const getRowHeight = (index: number): number => {
      return rowHeights.current[index] || 120;
    };

    const setRowHeight = useCallback((index: number, size: number): void => {
      if (listRef.current) {
        listRef.current.resetAfterIndex(0);
        rowHeights.current = { ...rowHeights.current, [index]: size };
      }
    }, []);

    const itemData = useMemo(
      () => ({
        setRowHeight,
      }),
      [setRowHeight]
    );

    const dataList = dataStore.dataList;

    const handleItemsRendered = async ({
      overscanStartIndex,
      overscanStopIndex,
      visibleStartIndex,
      visibleStopIndex,
    }: {
      overscanStartIndex: number;
      overscanStopIndex: number;
      visibleStartIndex: number;
      visibleStopIndex: number;
    }) => {
      if (
        (dataStore.upHasMore &&
          overscanStartIndex === 0 &&
          isUpDirection.current) ||
        (dataStore.downHasMore &&
          overscanStopIndex === dataList.length &&
          !isUpDirection.current)
      ) {
        console.log("overscanStartIndex", overscanStartIndex);
        console.log("overscanStopIndex", overscanStopIndex);
        console.log("visibleStartIndex", visibleStartIndex);
        console.log("visibleStopIndex", visibleStopIndex);
      }
      if (isFirstRender) {
        setIsFirstRender(false);
        return;
      }
      if (
        dataStore.upHasMore &&
        overscanStartIndex === 0 &&
        isUpDirection.current
      ) {
        const curId = dataList[0].id;
        const res = await dataStore.fetchData({
          target: dataList[0].id,
          upSize: 20,
          isFirst: false,
        });
        const preIdx = dataStore.dataList.findIndex(
          (data) => data.id === curId
        );
        setStartIndex(res.length);
        // if (listRef.current) listRef.current.scrollToItem(preIdx, "smart");
      }
      if (
        dataStore.downHasMore &&
        overscanStopIndex === dataList.length &&
        !isUpDirection.current
      ) {
        const curId = dataList[dataList.length - 1].id;
        dataStore.fetchData({
          target: dataList[dataList.length - 1].id,
          downSize: 20,
          isFirst: false,
        });
        const preIdx = dataStore.dataList.findIndex(
          (data) => data.id === curId
        );
        // if (listRef.current) listRef.current.scrollToItem(preIdx, "smart");
      }
    };

    const handleScroll = ({
      scrollDirection,
    }: {
      scrollDirection: ScrollDirection;
    }) => {
      if (scrollDirection === "backward") {
        isUpDirection.current = true;
      } else if (scrollDirection === "forward") {
        isUpDirection.current = false;
      }
    };

    useLayoutEffect(() => {
      //   console.log("listRef", listRef);
      if (listRef.current) listRef.current.scrollToItem(10, "center");
    }, []);

    return (
      <List
        height={height}
        itemCount={dataList.length}
        itemSize={getRowHeight}
        ref={listRef}
        width={width}
        overscanCount={3}
        onItemsRendered={handleItemsRendered}
        initialScrollOffset={startIndex * 100}
        onScroll={handleScroll}
        itemData={itemData}
      >
        {/* {({ index, style }) => (
      <Item
        key={data[index].id}
        style={style}
        message={data[index]}
      />
    )} */}
        {Row}
      </List>
    );
  }
);

const Main = observer(() => {
  const { dataStore } = useCoreStore();

  const getData = async (target: number, isFirst = false) => {
    await dataStore.fetchData({ target, upSize: 20, downSize: 20, isFirst });
    console.log(dataStore.dataList);
  };

  useEffect(() => {
    getData(500, true);
  }, []);

  return (
    <S.Background>
      <S.Wrapper>
        {dataStore.state !== "init" && (
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => (
              <MessageList width={width} height={height} />
            )}
          </AutoSizer>
        )}
      </S.Wrapper>
      <button
        onClick={() => {
          //   const metaData = {
          //     lastMessage: "new last message",
          //     lastMessageDate: "2024-04-02T00:00:00Z",
          //     count: 42,
          //   };
          //   dataStore.updateDataMetadata(503, metaData);
          getData(520, false);
        }}
      >
        {"change metadata"}
      </button>
    </S.Background>
  );
});

export default Main;
