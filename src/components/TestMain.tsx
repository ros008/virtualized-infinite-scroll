import React, { useCallback, useEffect, useRef, useState } from "react";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface ListItem {
  id: number;
  text: string;
  height: number;
}

const initialData: ListItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  text: `Item ${index}`,
  height: Math.floor(Math.random() * 101) + 50, // 높이는 50에서 150 사이의 랜덤 값
}));

const fetchData = (
  startIndex: number,
  stopIndex: number
): Promise<ListItem[]> => {
  // 이전 또는 이후 데이터를 가져오는 비동기 함수
  return new Promise((resolve) => {
    // 데이터를 가져오는 비동기 로직을 여기에 구현
    setTimeout(() => {
      const data: ListItem[] = Array.from(
        { length: stopIndex - startIndex },
        (_, index) => ({
          id: startIndex + index,
          text: `Item ${startIndex + index}`,
          height: Math.floor(Math.random() * 101) + 50, // 높이는 50에서 150 사이의 랜덤 값
        })
      );
      resolve(data);
    }, 1000);
  });
};

const TestMain = () => {
  const [data, setData] = useState<ListItem[]>(initialData);
  const [listRef, setListRef] = useState<VariableSizeList | null>(null);

  useEffect(() => {
    if (listRef) {
      const initialScrollIndex = Math.floor(initialData.length / 2);
      listRef.scrollToItem(initialScrollIndex, "center");
    }
  }, [listRef]);

  const loadPreviousData = useCallback(() => {
    fetchData(data[0].id - 10, data[0].id).then((newData) => {
      setData((prevData) => [...newData, ...prevData]);
      listRef?.resetAfterIndex(newData.length - 1);
    });
  }, [data, listRef]);

  const loadNextData = useCallback(() => {
    fetchData(data[data.length - 1].id + 1, data[data.length - 1].id + 11).then(
      (newData) => {
        setData((prevData) => [...prevData, ...newData]);
      }
    );
  }, [data]);

  const handleScroll = useCallback(
    ({
      scrollDirection,
      scrollOffset,
    }: {
      scrollDirection: string;
      scrollOffset: number;
    }) => {
      // if (scrollDirection === "backward" && scrollOffset === 0) {
      //   loadPreviousData();
      // } else if (
      //   scrollDirection === "forward" &&
      //   scrollOffset > listRef?.getTotalSize()! - 600 - 10
      // ) {
      //   loadNextData();
      // }
    },
    [loadPreviousData, loadNextData, listRef]
  );

  const getItemSize = useCallback(
    (index: number) => data[index].height,
    [data]
  );

  return (
    <div style={{ height: 600, width: 400 }}>
      <VariableSizeList
        height={600}
        width={400}
        itemCount={data.length}
        itemSize={getItemSize}
        onScroll={handleScroll}
        ref={(ref) => setListRef(ref)}
      >
        {({ index, style }) => (
          <div style={{ ...style, border: "1px solid gray", padding: "5px" }}>
            {data[index].text}
          </div>
        )}
      </VariableSizeList>
    </div>
  );
};

export default TestMain;
