import axios from "axios";
import { AuthResponse } from "../utils/types";

const API_URL = "http://localhost:3000";

export const AuthService = {
  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });
    return response.data;
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signin`, {
      email,
      password,
    });
    return response.data;
  },
};
