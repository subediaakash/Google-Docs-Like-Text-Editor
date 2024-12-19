// src/recoil/auth.ts
import { atom } from "recoil";

const authAtom = atom<string | null>({
  key: "authAtom",
  default: localStorage.getItem("token"),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue) {
          localStorage.setItem("token", newValue);
        } else {
          localStorage.removeItem("token");
        }
      });
    },
  ],
});

export default authAtom;
