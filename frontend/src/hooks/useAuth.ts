import { useRecoilState } from "recoil";
import authAtom from "../recoil/auth";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

export const useAuth = () => {
  const [token, setToken] = useRecoilState(authAtom);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const getUser = (): TokenPayload | null => {
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  };

  return {
    token,
    user: getUser(),
    isAuthenticated: !!token,
    login,
    logout,
  };
};
