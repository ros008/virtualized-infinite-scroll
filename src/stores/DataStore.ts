import { makeAutoObservable, ObservableMap, values } from "mobx";
import { DataModel, Metadata } from "../models/DataModel";
import moment from "moment";
import mockData from "../mock/MOCK_DATA.json";

const GET_LENGTH = 20;

type State = "init" | "loading" | "done";

export class DataStore {
  private __dataMap: ObservableMap<number, DataModel> = new ObservableMap();
  private __downHasMore: boolean = false;
  private __upHasMore: boolean = false;
  private __state: State = "init";

  constructor() {
    makeAutoObservable(this);
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

  get dataMap() {
    return this.__dataMap;
  }

  get dataArray() {
    // const timeFormat = `YYYY-MM-DD HH:mm:ss ZZ`;
    // const dataList = values(this.dataMap);

    // const noneImageData: DataModel[] = dataList.filter((data) => !data.image);

    // const normalData: DataModel[] = dataList
    //   .filter((data) => data.image)
    //   .sort((a, b) => {
    //     const recentDate1 = a.metadata?.lastMessageDate;
    //     const recentDate2 = b.metadata?.lastMessageDate;
    //     const aTime = moment(recentDate1, timeFormat);
    //     const bTime = moment(recentDate2, timeFormat);
    //     return bTime.diff(aTime);
    //   });

    // return [...normalData, ...noneImageData];

    const dataList = values(this.dataMap);
    return dataList;
  }

  setData = (dataMap: Map<number, DataModel>) => {
    this.dataMap.merge(dataMap);
  };

  getData(dataId: number) {
    return this.dataMap.get(dataId);
  }

  updateDataMetadata(dataId: number, metaData: Metadata) {
    const selectedMetadata = this.getData(dataId);
    if (selectedMetadata) {
      selectedMetadata.setMetadata(metaData);
    }
  }

  async fetchData(
    startIdx: number,
    size: number = 20,
    isFirst: boolean
  ): Promise<DataModel[]> {
    if (isFirst) this.setState("init");
    else this.setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newData = mockData.slice(startIdx, startIdx + GET_LENGTH);
    const returnArray: DataModel[] = [];
    if (newData[0]?.id === 1) this.setUpHasMore(false);
    else this.setUpHasMore(true);
    if (newData[newData.length - 1]?.id === 1000) this.setDownHasMore(false);
    else this.setDownHasMore(true);
    newData.map((data) => {
      const modelData = new DataModel(data);
      this.setData(new Map([[modelData.id, modelData]]));
      returnArray.push(modelData);
    });
    this.setState("done");
    return returnArray;
  }
}
