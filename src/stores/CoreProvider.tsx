import React, { createContext, useContext } from "react";
import { coreStore, CoreStore } from "./CoreStore";
import { DataProvider } from "./DataProvider";

const CoreStoreContext = createContext<CoreStore>(coreStore);

export const CoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DataProvider>
      <CoreStoreContext.Provider value={coreStore}>
        {children}
      </CoreStoreContext.Provider>
    </DataProvider>
  );
};

export const useCoreStore = (): CoreStore => useContext(CoreStoreContext);
