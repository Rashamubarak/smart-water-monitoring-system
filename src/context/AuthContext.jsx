// rfce
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  // load saved user from localStorage
  const [user, setUser] = useState(localStorage.getItem("user"));

  const login = (email) => {
    setUser(email);
    localStorage.setItem("user", email); // store user
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // remove user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
