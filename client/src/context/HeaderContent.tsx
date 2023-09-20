import React, { useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

type HeaderContentType = ReactNode;
type SetHeaderContentType = Dispatch<SetStateAction<HeaderContentType | null>>;

const HeaderContentContext = React.createContext<SetHeaderContentType | null>(null);

export const useHeaderContent = () => {
    return useContext(HeaderContentContext);
};

type HeaderContentProviderProps = {
    children: (content: HeaderContentType) => ReactNode;
};

export const HeaderContentProvider: React.FC<HeaderContentProviderProps> = ({ children }) => {
    const [headerContent, setHeaderContent] = useState<HeaderContentType | null>(null);
    return (
        <HeaderContentContext.Provider value={setHeaderContent}>
            {children(headerContent)}
        </HeaderContentContext.Provider>
    );
};
