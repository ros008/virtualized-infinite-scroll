import { DataType } from "./../mock/mockType";
import { makeAutoObservable, set } from "mobx";

export type Metadata = {
  lastMessage: string;
  lastMessageDate: string;
  count: number;
};

export class DataModel {
  id: number = 0;
  first_name: string = "";
  last_name: string = "";
  profile: string = "";
  text: string = "";
  image: string = "";
  metadata: Metadata = {
    lastMessage: "",
    lastMessageDate: "",
    count: 0,
  };

  constructor(data: DataType) {
    makeAutoObservable(this);
    this.setValues(data);
  }

  setValues(data: DataType) {
    // const memo = this.metadata;
    set(this, data);
    // this.setMetadata(memo);
  }

  setMetadata(data: Metadata) {
    this.metadata = { ...this.metadata, ...data };
  }
}
