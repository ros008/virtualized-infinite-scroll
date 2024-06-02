import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef } from "react";
import Item from "./MessageItem/Item";
import { useCoreStore } from "../stores/CoreProvider";

interface Data {
  setRowHeight: (index: number, size: number) => void;
}

interface RowProps {
  data: Data;
  index: number;
  style: React.CSSProperties;
}

const Row: FC<RowProps> = observer(({ index, style, data }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { dataStore } = useCoreStore();
  const { setRowHeight } = data;
  const dataList = dataStore.dataList[index];

  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(index, rowRef.current.clientHeight);
    }

    // eslint-disable-next-line
  }, [rowRef]);

  //   useEffect(() => {
  //     console.log("reRendered", index);
  //   }, []);

  return (
    <div style={style}>
      <Item ref={rowRef} message={dataList} idx={index} />
    </div>
  );
});

export default Row;
