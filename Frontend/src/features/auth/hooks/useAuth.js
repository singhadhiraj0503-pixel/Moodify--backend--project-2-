import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setuser, loading, setloading } = context;

  const handleRegister = async ({ username, email, password }) => {
    setloading(true);
    const data = await register({ username, email, password });
    setuser(data.user);
    setloading(false);
  };

  const handleLogin = async ({ username, email, password }) => {
    setloading(true);
    const data = await login({ username, email, password });
    setuser(data.user);
    setloading(false);
  };

  const handleGetMe = async () => {
    setloading(true);
    const data = await getMe();
    setuser(data.user);
    setloading(false);
  };

  const handleLogout = async () => {
    setloading(true);
    const data = await logout();
    setuser(data.user);
    setloading(false);
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
  };
};
