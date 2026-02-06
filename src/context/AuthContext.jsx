import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

function AuthContextProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ NEW: Premium State
  const [isPremium, setIsPremium] = useState(false);

  // ============================
  // Load user, token & premium
  // ============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedPremium = localStorage.getItem("isPremium");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid auth data, clearing storage");
        localStorage.clear();
      }
    }

    if (storedPremium) {
      setIsPremium(JSON.parse(storedPremium));
    }
  }, []);

  // ============================
  // Login handler
  // ============================
  const login = (userData, authToken = null) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData));

    if (authToken) {
      localStorage.setItem("token", authToken);
    }
  };

  // ============================
  // Logout handler
  // ============================
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
      value={{
        user,
        token,
        login,
        logout,
        isPremium,
        setIsPremium
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
