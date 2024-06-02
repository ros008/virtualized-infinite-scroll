import { observer } from "mobx-react-lite";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as S from "./styled";
import { VariableSizeList as List, ScrollDirection } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const MessageList = observer(
  ({ width, height }: { width: number; height: number }) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [key: number]: number }>({});
    const isUpDirection = useRef(false);

    const [dataList, setDataList] = useState(
      Array.from({ length: 30 }, (_, i) => `Item ${i + 500}`)
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [scrollTop, setScrollTop] = useState<number>(0);

    const loadMoreItems = (startIndex: number, stopIndex: number) => {
      setIsLoading(true);
      // Simulating async data fetching
      setTimeout(() => {
        const newData = Array.from(
          { length: stopIndex - startIndex },
          (_, i) => `Item ${startIndex + i}`
        );
        setDataList((prevData) => [
          ...prevData.slice(0, startIndex),
          ...newData,
          ...prevData.slice(stopIndex),
        ]);
        setIsLoading(false);
        listRef.current?.scrollTo(scrollTop);
      }, 1000);
    };

    const getRowHeight = (index: number): number => {
      return rowHeights.current[index] || 100;
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
      console.log(
        overscanStartIndex,
        overscanStopIndex,
        visibleStartIndex,
        visibleStopIndex
      );
    };

    const handleScroll = ({ scrollOffset }: { scrollOffset: number }) => {
      console.log(scrollOffset);
      if (scrollOffset === 0) {
        // Fetch previous data
        setScrollTop(scrollOffset);
        loadMoreItems(0, 20);
      } else if (scrollOffset >= (dataList.length - 5) * 50) {
        // Fetch next data
        loadMoreItems(dataList.length, dataList.length + 20);
      }
    };

    useLayoutEffect(() => {
      //   console.log("listRef", listRef);
      if (listRef.current) listRef.current.scrollToItem(10, "center");
    }, []);

    const Row = ({
      index,
      style,
    }: {
      index: number;
      style: React.CSSProperties;
    }) => <div style={style}>Row {dataList[index]}</div>;

    return (
      <List
        height={height}
        itemCount={dataList.length}
        estimatedItemSize={100}
        itemSize={getRowHeight}
        ref={listRef}
        width={width}
        overscanCount={3}
        initialScrollOffset={15}
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

const BasicMain = observer(() => {
  return (
    <S.Background>
      <S.Wrapper>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <MessageList width={width} height={height} />
          )}
        </AutoSizer>
      </S.Wrapper>
    </S.Background>
  );
});

export default BasicMain;
