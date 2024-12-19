import { selector, DefaultValue } from "recoil";
import authAtom from "./atom";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

const authWithUser = selector<TokenPayload | null>({
  key: "authWithUser",
  get: ({ get }) => {
    const authToken = get(authAtom);

    if (!authToken) {
      return null;
    }

    try {
      return jwtDecode<TokenPayload>(authToken);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
  set: ({ set }, newValue: TokenPayload | DefaultValue | null) => {
    if (newValue instanceof DefaultValue || newValue === null) {
      set(authAtom, null);
      return;
    }

    const token = JSON.stringify(newValue);
    set(authAtom, token);
  },
});

export default authWithUser;
