export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: Owner;
}
