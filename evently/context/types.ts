export type User = {
  username: string;
  token: string;
  role?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, username: string, role: string, password: string) => Promise<void>; // Add register function
  isLoading: boolean;
};

