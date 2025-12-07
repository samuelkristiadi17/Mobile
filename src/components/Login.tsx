import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UtensilsCrossed, Eye, EyeOff, User, Lock, Sparkles } from "lucide-react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");        
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { 
    login, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithTwitter 
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Email dan password harus diisi");
      return;
    }

    const success = await login(email, password);

    if (success) {
      toast.success("Login berhasil!");
    } else {
      toast.error("Email atau password salah");
    }
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

    {/* CONTENT */}
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-2xl mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-white-600 rounded-2xl"></div>
          <UtensilsCrossed className="h-12 w-12 text-orange-600 relative z-10" />
        </div>

        <p className="text-orange-50 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          Sistem Kasir Food Modern
          <Sparkles className="h-4 w-4" />
        </p>
      </div>

      <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-4"></CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative group">
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
              <div className="relative group">
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

            {/* LOGIN */}
            <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white h-11">
              Login
            </Button>

            {/* REGISTER */}
            <Button
              type="button"
              className="w-full bg-white border border-gray-300 text-gray-700 h-11"
              onClick={() => (window.location.href = "/register")}
            >
              Belum punya akun? Daftar
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Forgot Password?</span>
              </div>
            </div>

{/* === SOCIAL LOGIN === */}
<div className="space-y-3">

  {/* GOOGLE LOGIN WITH ICON */}
  <Button
    type="button"
    variant="outline"
    className="w-full h-11 border-2 hover:bg-gray-50 transition-all duration-300 group flex items-center justify-center"
    onClick={async () => {
      const ok = await loginWithGoogle();
      if (!ok) toast.error("Google login gagal");
    }}
  >
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    <span className="font-medium">Login dengan Google</span>
  </Button>

  {/* FACEBOOK LOGIN WITH ICON */}
  <Button
    type="button"
    variant="outline"
    className="w-full h-11 border-2 hover:bg-blue-50 transition-all duration-300 group flex items-center justify-center"
    onClick={async () => {
      const ok = await loginWithFacebook();
      if (!ok) toast.error("Facebook login gagal");
    }}
  >
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path 
        fill="#1877F2" 
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
    <span className="font-medium">Login dengan Facebook</span>
  </Button>

  {/* TWITTER LOGIN WITH ICON */}
  <Button
    type="button"
    variant="outline"
    className="w-full h-11 border-2 hover:bg-gray-50 transition-all duration-300 group flex items-center justify-center"
    onClick={async () => {
      const ok = await loginWithTwitter();
      if (!ok) toast.error("Twitter login gagal");
    }}
  >
    <svg className="w-5 h-5 mr-3" fill="#1DA1F2" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
    <span className="font-medium">Login dengan Twitter</span>
  </Button>

  <center>
    <h4>
      Butuh bantuan? Hubungi{" "}
      <a href="mailto:support@foodkasir.com" className="text-orange-600 font-semibold">
        support@foodkasir.com
      </a>
    </h4>
  </center>

</div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
