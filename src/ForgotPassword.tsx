import { useState } from "react";
import type { ChangeEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "sonner";
import { Input } from "./components/ui/input";

/**
 * Local fallback Button component to avoid missing ./ui/button import.
 * Lightweight and typed leniently (any) to keep this file self-contained.
 */
function Button({ children, className, variant, onClick, ...rest }: any) {
const outlineClass = variant === "outline" ? "border border-gray-300 bg-transparent" : "";
return (
    <button
type="button"
className={`${outlineClass} ${className ?? ""}`.trim()}
onClick={onClick}
{...rest}
    >
{children}
    </button>
);
}

export function ForgotPassword() {
const [email, setEmail] = useState("");

const handleReset = async () => {
    if (!email) {
toast.error("Email harus diisi");
return;
    }

    await sendPasswordResetEmail(auth, email);
    toast.success("Email reset telah dikirim");
};

return (
    <div className="min-h-screen flex items-center justify-center bg-orange-500 p-6">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Reset Password</h1>

        <Input
        type="email"
        placeholder="Masukkan email akun"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <Button onClick={handleReset}>
        Kirim Link Reset
        </Button>

        <Button variant="outline" onClick={() => (window.location.href = "/")}>
        Kembali ke Login
        </Button>
    </div>
    </div>
);
}
