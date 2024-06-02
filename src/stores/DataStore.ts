import { makeAutoObservable, ObservableMap, values } from "mobx";
import { DataModel, Metadata } from "../models/DataModel";
import moment from "moment";
import mockData from "../mock/MOCK_DATA.json";

const GET_LENGTH = 20;

type State = "init" | "loading" | "done";

export class DataStore {
  private __dataList: DataModel[] = [];
  private __downHasMore: boolean = false;
  private __upHasMore: boolean = false;
  private __state: State = "init";

  constructor() {
    makeAutoObservable(this);
  }

  get dataList() {
    return this.__dataList;
  }

  get downHasMore() {
    return this.__downHasMore;
  }

  get upHasMore() {
    return this.__upHasMore;
  }

  get state() {
    return this.__state;
  }

  setState(state: State) {
    this.__state = state;
  }

  setDownHasMore(data: boolean) {
    this.__downHasMore = data;
  }
  setUpHasMore(data: boolean) {
    this.__upHasMore = data;
  }
  setDataList(dataList: DataModel[]) {
    this.__dataList = dataList;
  }

  async fetchData({
    target,
    upSize,
    downSize,
    isFirst,
  }: {
    target: number;
    upSize?: number;
    downSize?: number;
    isFirst: boolean;
  }) {
    if (isFirst) this.setState("init");
    else this.setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(
      "target",
      target,
      "upSize",
      upSize,
      "downSize",
      downSize,
      "isFirst",
      isFirst,
      upSize ? target - upSize : target,
      downSize ? target + downSize + 1 : target
    );

    const newData = mockData.slice(
      upSize ? (target - upSize >= 0 ? target - upSize : 0) : target,
      downSize ? target + downSize + 1 : target
    );
    if (newData[0]?.id === 1) this.setUpHasMore(false);
    else this.setUpHasMore(true);
    if (newData[newData.length - 1]?.id === 1000) this.setDownHasMore(false);
    else this.setDownHasMore(true);
    const newDataList = newData.map((data) => {
      const modelData = new DataModel(data);
      return modelData;
    });
    if (upSize && downSize) {
      this.setDataList(newDataList);
    } else if (upSize && !downSize) {
      this.setDataList(newDataList.concat(this.dataList));
    } else if (!upSize && downSize) {
      this.setDataList(this.dataList.concat(newDataList));
    }
    console.log(
      "upHasMore",
      this.upHasMore,
      "downHasMore",
      this.downHasMore,
      this.dataList.length
    );
    this.setState("done");
    return newData;
  }
}
