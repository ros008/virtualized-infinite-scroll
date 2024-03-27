import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
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

    const dataList = dataStore.dataArray;

    const handleItemsRendered = ({
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
      console.log("overscanStartIndex", overscanStartIndex);
      console.log("overscanStopIndex", overscanStopIndex);
      console.log("visibleStartIndex", visibleStartIndex);
      console.log("visibleStopIndex", visibleStopIndex);
    };

    const handleScroll = ({
      scrollDirection,
    }: {
      scrollDirection: ScrollDirection;
    }) => {
      if (scrollDirection === "forward") {
        isUpDirection.current = true;
      } else {
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

  const getData = async (
    startIdx: number,
    size: number = 20,
    isFirst = false
  ) => {
    await dataStore.fetchData(startIdx, size, isFirst);
    console.log(dataStore.dataArray);
  };

  useEffect(() => {
    getData(500, 20, true);
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
          getData(520, 20, false);
        }}
      >
        {"change metadata"}
      </button>
    </S.Background>
  );
});

export default Main;
