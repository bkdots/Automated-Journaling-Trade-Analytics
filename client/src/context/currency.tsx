import { createContext, useState, useContext, ReactNode } from "react";

export type Currency = "USD" | "CAD" | "GBP" | "EUR";

interface CurrencyContextProps {
    currentCurrency: Currency;
    setCurrency: (currency: Currency) => void;
}

export const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [currentCurrency, setCurrentCurrency] = useState<Currency>("USD");

    return (
        <CurrencyContext.Provider value={{currentCurrency, setCurrency: setCurrentCurrency}}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};