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
import data from "../mock/MOCK_DATA.json";
import { DataModel } from "../models/DataModel";

export const dataList = data.slice(0, 50) as DataModel[];

const MessageList = observer(
  ({ width, height }: { width: number; height: number }) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [key: number]: number }>({});
    const isUpDirection = useRef(false);

    const [isFirstRender, setIsFirstRender] = useState(true);

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

    const handleScroll = ({
      scrollDirection,
    }: {
      scrollDirection: ScrollDirection;
    }) => {
      console.log(scrollDirection);
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

const NewMain = observer(() => {
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

export default NewMain;
