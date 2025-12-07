import { AuthProvider, useAuth } from "./components/AuthContext";


export function ProtectedRoute({ children, role }: { children: any; role?: "admin" | "staff" }) {
const { user, isLoading } = useAuth();

if (isLoading) return null;

if (!user) {
    window.location.href = "/";
    return null;
}

if (role && user.role !== role) {
    window.location.href = "/unauthorized";
    return null;
}

return children;
}
