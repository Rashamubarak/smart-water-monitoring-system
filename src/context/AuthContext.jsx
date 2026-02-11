import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedPremium = localStorage.getItem("isPremium");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    if (storedPremium) setIsPremium(JSON.parse(storedPremium));
  }, []);

  useEffect(() => {
    localStorage.setItem("isPremium", JSON.stringify(isPremium));
  }, [isPremium]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsPremium(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isPremium");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isPremium, setIsPremium }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
