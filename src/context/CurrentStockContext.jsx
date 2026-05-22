import { createContext, useState } from "react";

const CurrentStockContext = createContext();

function CurrentStockProvider({ children }) {
  const [currentStock, setCurrentStock] = useState(null);
  const [currentStockDescription, setCurrentStockDescription] = useState(null);
  return (
    <CurrentStockContext.Provider
      value={{
        currentStock,
        setCurrentStock,
        currentStockDescription,
        setCurrentStockDescription,
      }}
    >
      {children}
    </CurrentStockContext.Provider>
  );
}

export { CurrentStockProvider, CurrentStockContext };
