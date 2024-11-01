import React, { createContext, useState, useContext, useEffect } from "react";
import tmdbApi from "../api/tmdbApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
    setLoading(false);
  }, [auth]);

  const login = async (username, password) => {
    try {
      setError(null);
      // Get request token
      const { data: tokenData } = await tmdbApi.getRequestToken();
      const requestToken = tokenData.request_token;

      // Validate with login
      await tmdbApi.validateWithLogin(username, password, requestToken);

      // Create session
      const { data: sessionData } = await tmdbApi.createSession(requestToken);
      const { data: accountData } = await tmdbApi.getAccountDetails(
        sessionData.session_id
      );

      setAuth({
        sessionId: sessionData.session_id,
        accountId: accountData.id,
        username: accountData.username,
      });

      return true;
    } catch (err) {
      setError(err.response?.data?.status_message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (auth?.sessionId) {
        await tmdbApi.deleteSession(auth.sessionId);
      }
    } finally {
      setAuth(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        error,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
