import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

// ===== ROLE LIST =====
const ADMIN_EMAIL = "admin@foodkasir.com";

const STAFF_EMAILS = [
  "staff@foodkasir.com",
  "staff1@foodkasir.com",
]; // <-- add staff emails here

export interface User {
  uid: string;
  email: string;
  role: "admin" | "staff" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  loginWithTwitter: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ROLE LOGIC
  const mapUser = (fb: FirebaseUser | null): User | null => {
    if (!fb) return null;

    let role: "admin" | "staff" | "user" = "user";

    if (fb.email === ADMIN_EMAIL) {
      role = "admin";
    } else if (fb.email && STAFF_EMAILS.includes(fb.email)) {
      role = "staff";
    } else {
      role = "user";
    }

    return {
      uid: fb.uid,
      email: fb.email ?? "",
      role,
    };
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(mapUser(fbUser));
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch {
      setError("Login gagal");
      return false;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch {
      setError("Registrasi gagal");
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      return true;
    } catch {
      return false;
    }
  };

  const loginWithFacebook = async () => {
    try {
      await signInWithPopup(auth, new FacebookAuthProvider());
      return true;
    } catch {
      return false;
    }
  };

  const loginWithTwitter = async () => {
    try {
      await signInWithPopup(auth, new TwitterAuthProvider());
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        loginWithTwitter,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
