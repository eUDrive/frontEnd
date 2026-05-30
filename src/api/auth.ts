import { http } from "./http";

export interface LoginResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    console.log("🔍 Login attempt:", { email });
    const res = await http.post<LoginResponse>("/api/auth/login", { email, password });
    console.log("✅ Login response:", res.data);

    const token: string = res.data.token;

    localStorage.setItem("token", token);
    console.log("✅ Token saved to localStorage");
    return token;
  } catch (error) {
    console.error("❌ Login error:", error);
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem("token");
  console.log("✅ Logged out");
}
