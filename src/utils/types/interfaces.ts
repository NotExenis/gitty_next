export interface session {
  id: number;
  name: string;
  expires_at: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface NavItem {
  name: string;
  href: string;
}

export interface UserState {
  isAuthenticated: boolean;
  role: "guest" | "user" | "admin";
}

// deno-lint-ignore no-explicit-any
export type JwtClaims = { [key: string]: never };
