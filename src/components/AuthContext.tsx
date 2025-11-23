import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithSocial: (provider: string, token: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration - Switch between mock and real API
const USE_MOCK_DATA = true; // Set to false when using real API
const API_BASE_URL = "http://localhost:3001/api"; // Change to your backend URL

// Mock users - for development only
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "Administrator",
    email: "admin@foodkasir.com",
    role: "admin",
  },
  {
    id: "2",
    username: "kasir1",
    password: "kasir123",
    name: "Kasir Satu",
    email: "kasir1@foodkasir.com",
    role: "staff",
  },
  {
    id: "3",
    username: "kasir2",
    password: "kasir123",
    name: "Kasir Dua",
    email: "kasir2@foodkasir.com",
    role: "staff",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved session
    const checkAuth = async () => {
      const token = localStorage.getItem("foodkasir_token");
      const savedUser = localStorage.getItem("foodkasir_user");

      if (token && savedUser) {
        try {
          if (USE_MOCK_DATA) {
            // Mock: Just restore from localStorage
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } else {
            // Real API: Verify token with backend
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem("foodkasir_token");
              localStorage.removeItem("foodkasir_user");
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem("foodkasir_token");
          localStorage.removeItem("foodkasir_user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      if (USE_MOCK_DATA) {
        // Mock login
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        const foundUser = MOCK_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (foundUser) {
          const userWithoutPassword: User = {
            id: foundUser.id,
            username: foundUser.username,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            avatar: foundUser.avatar,
          };
          
          setUser(userWithoutPassword);
          localStorage.setItem("foodkasir_user", JSON.stringify(userWithoutPassword));
          localStorage.setItem("foodkasir_token", "mock-token-" + Date.now());
          setIsLoading(false);
          return true;
        }

        setError("Username atau password salah");
        setIsLoading(false);
        return false;
      } else {
        // Real API login
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          localStorage.setItem("foodkasir_user", JSON.stringify(data.user));
          localStorage.setItem("foodkasir_token", data.token);
          setIsLoading(false);
          return true;
        } else {
          setError(data.message || "Login gagal");
          setIsLoading(false);
          return false;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login");
      setIsLoading(false);
      return false;
    }
  };

  const loginWithSocial = async (provider: string, token: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      if (USE_MOCK_DATA) {
        // Mock social login
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockSocialUser: User = {
          id: "social-" + Date.now(),
          username: `${provider.toLowerCase()}_user`,
          name: `${provider} User`,
          email: `user@${provider.toLowerCase()}.com`,
          role: "staff",
        };

        setUser(mockSocialUser);
        localStorage.setItem("foodkasir_user", JSON.stringify(mockSocialUser));
        localStorage.setItem("foodkasir_token", "mock-social-token-" + Date.now());
        setIsLoading(false);
        return true;
      } else {
        // Real API social login
        const response = await fetch(`${API_BASE_URL}/auth/social/${provider.toLowerCase()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          localStorage.setItem("foodkasir_user", JSON.stringify(data.user));
          localStorage.setItem("foodkasir_token", data.token);
          setIsLoading(false);
          return true;
        } else {
          setError(data.message || "Social login gagal");
          setIsLoading(false);
          return false;
        }
      }
    } catch (error) {
      console.error("Social login error:", error);
      setError("Terjadi kesalahan saat social login");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("foodkasir_user");
    localStorage.removeItem("foodkasir_token");
    
    // Optional: Call backend logout endpoint
    if (!USE_MOCK_DATA) {
      const token = localStorage.getItem("foodkasir_token");
      if (token) {
        fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(err => console.error("Logout error:", err));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithSocial, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}