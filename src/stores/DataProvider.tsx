import { coreStore } from "./CoreStore";
import React, { createContext, useContext } from "react";

const dataStoreContext = createContext(coreStore.dataStore);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <dataStoreContext.Provider value={coreStore.dataStore}>
      {children}
    </dataStoreContext.Provider>
  );
};

export const useDataStore = () => useContext(dataStoreContext);
