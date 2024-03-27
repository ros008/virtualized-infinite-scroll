import { DataStore } from "./DataStore";

export class CoreStore {
  dataStore: DataStore = new DataStore();
}

export const coreStore = new CoreStore();
