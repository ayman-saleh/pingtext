export interface User {
  id: string;
  email: string;
  name: string;
  apiKey: string;
  createdAt: string;
}

const STORAGE_KEY = "pingtext_user";

export function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "pt_live_";
  for (let i = 0; i < 24; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export function signUp(email: string, password: string, name: string): User {
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    apiKey: generateApiKey(),
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(`pingtext_pwd_${email}`, password);
  }
  return user;
}

export function signIn(email: string, password: string): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(`pingtext_pwd_${email}`);
  if (stored !== password) return null;
  const userData = localStorage.getItem(STORAGE_KEY);
  if (!userData) return null;
  const user = JSON.parse(userData) as User;
  if (user.email !== email) return null;
  return user;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  return JSON.parse(data) as User;
}

export function signOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
