export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
