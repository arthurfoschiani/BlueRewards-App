import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  return (
    <UserContext.Provider value={{ points, setPoints }}>
      {children}
    </UserContext.Provider>
  );
};