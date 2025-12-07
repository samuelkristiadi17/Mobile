import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UtensilsCrossed, Sparkles, Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export function Register() {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Password tidak sama");
      return;
    }

    const ok = await register(email, password);
    if (ok) {
      toast.success("Registrasi berhasil");
      window.location.href = "/";
    } else toast.error("Registrasi gagal");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.05),transparent_50%)]"></div>

      {/* Floating lights */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-2xl mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-white-600 rounded-2xl"></div>
            <UtensilsCrossed className="h-12 w-12 text-orange-600 relative z-10" />
          </div>
          <p className="text-orange-50 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Registrasi Akun Baru
            <Sparkles className="h-4 w-4" />
          </p>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader />

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <Label>Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                </div>
              </div>

              {/* REGISTER BUTTON */}
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white h-11">
                Daftar
              </Button>

              {/* Back to Login */}
              <Button
                type="button"
                className="w-full bg-white border border-gray-300 text-gray-700 h-11"
                onClick={() => (window.location.href = "/")}
              >
                Sudah punya akun? Login
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
