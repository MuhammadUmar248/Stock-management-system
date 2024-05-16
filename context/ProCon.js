// contexts/MyContext.js
import React, { createContext, useState, useContext } from 'react';

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [value, setValue] = useState([]);
  const [formval, setFormval] = useState(false)
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState([]);



  return (
    <MyContext.Provider value={{ value, setValue, formval, setFormval, setLoading, loading, setOriginalData, originalData }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
