import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FoodMenu, type FoodItem } from "./components/FoodMenu";
import { CartDrawer, type CartItem } from "./components/CartDrawer";
import { FloatingCartButton } from "./components/FloatingCartButton";
import { SalesHistory, type Transaction } from "./components/SalesHistory";
import { AddMenuDialog } from "./components/AddMenuDialog";
import { UtensilsCrossed, Receipt, BarChart3, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { Login } from "./components/Login";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { PaymentDialog } from "./components/PaymentDialog";

const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    price: 25000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1680674814945-7945d913319c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwZ29yZW5nJTIwZm9vZHxlbnwxfHx8fDE3NjA4ODYyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "2",
    name: "Mie Ayam",
    price: 20000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1569924220711-b1648079a75b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWUlMjBheWFtJTIwbm9vZGxlc3xlbnwxfHx8fDE3NjA4ODYyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "3",
    name: "Bakso",
    price: 18000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1722239312531-486bbfd50f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtzbyUyMG1lYXRiYWxsJTIwc291cHxlbnwxfHx8fDE3NjA4ODYyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "4",
    name: "Sate Ayam",
    price: 30000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1634871572365-8bc444e6faea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlJTIwc2F0YXl8ZW58MXx8fHwxNzYwODg2MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "5",
    name: "Ayam Goreng",
    price: 22000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzYwODUwNzExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "6",
    name: "Rendang",
    price: 35000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1638569099509-2f46eb4bb94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5kYW5nJTIwaW5kb25lc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzYxNzA3MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "7",
    name: "Gado-Gado",
    price: 18000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1707269561481-a4a0370a980a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWRvJTIwZ2FkbyUyMHNhbGFkfGVufDF8fHx8MTc2MTcwNzE4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "8",
    name: "Soto Ayam",
    price: 20000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3RvJTIwc291cCUyMGluZG9uZXNpYW58ZW58MXx8fHwxNzYxNjQ0MDg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "9",
    name: "Capcay",
    price: 22000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBjYXklMjB2ZWdldGFibGVzfGVufDF8fHx8MTc2MTcwNzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "10",
    name: "Nasi Goreng Seafood",
    price: 28000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1707269714960-320c5d6f47b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBpbmRvbmVzaWFufGVufDF8fHx8MTc2MTcwNzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "11",
    name: "Pecel Lele",
    price: 19000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1612426357506-8b66a851fbe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWNlbCUyMGxlbGUlMjBmaXNofGVufDF8fHx8MTc2MTcwNzE4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "12",
    name: "Nasi Uduk",
    price: 17000,
    category: "Makanan Utama",
    image: "https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXNpJTIwdWR1ayUyMHJpY2V8ZW58MXx8fHwxNzYxNzA3MTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "13",
    name: "Nasi Uduk",
    price: 17000,
    category: "Makanan Utama",
    image: "download.jpg",
    available: true,
  },
  {
    id: "14",
    name: "Es Teh Manis",
    price: 5000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1626759292870-5813c8c647c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcyUyMHRlaCUyMGljZSUyMHRlYXxlbnwxfHx8fDE3NjA4ODYyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "15",
    name: "Jus Jeruk",
    price: 12000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZXxlbnwxfHx8fDE3NjA4ODYyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "16",
    name: "Kopi",
    price: 10000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NjA3NjE5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "17",
    name: "Teh Tarik",
    price: 8000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1674749232554-2ac15ced3954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWglMjB0YXJpayUyMHRlYXxlbnwxfHx8fDE3NjE3MDcxODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "18",
    name: "Jus Alpukat",
    price: 15000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1623123093799-70a72826e167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwanVpY2V8ZW58MXx8fHwxNzYxNzA3MTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "19",
    name: "Jus Mangga",
    price: 13000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGp1aWNlJTIwZnJlc2h8ZW58MXx8fHwxNzYxNzA3MTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "20",
    name: "Es Lemon Tea",
    price: 8000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1599390719613-912787a6e65a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMHRlYSUyMGljZWR8ZW58MXx8fHwxNzYxNzA3MTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
  {
    id: "21",
    name: "Cappuccino",
    price: 18000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlfGVufDF8fHx8MTc2MTcwNzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    available: true,
  },
];

function DashboardContent() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false); // TAMBAHAN: State untuk payment dialog
  const { user, logout } = useAuth();

  const handleAddToCart = (item: FoodItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        toast.success(`${item.name} ditambahkan ke keranjang`);
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1, image: item.image }
            : cartItem
        );
      }
      toast.success(`${item.name} ditambahkan ke keranjang`);
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info("Item dihapus dari keranjang");
  };

  // UPDATE: Fungsi handleCheckout untuk membuka payment dialog
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Tutup cart drawer dan buka payment dialog
    setCartOpen(false);
    setPaymentOpen(true);
  };

  // TAMBAHAN: Fungsi untuk menyelesaikan pembayaran
  const handlePaymentComplete = () => {
    if (cartItems.length === 0) return;

    const now = new Date();
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      date: now.toLocaleDateString('id-ID'),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax,
      total,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setCartItems([]);
    toast.success(`Transaksi berhasil! Total: Rp ${total.toLocaleString('id-ID')}`);
  };

  const handleAddMenu = (newItem: Omit<FoodItem, "id">) => {
    const newFoodItem: FoodItem = {
      ...newItem,
      id: `custom-${Date.now()}`,
    };
    setFoodItems(prev => [...prev, newFoodItem]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <UtensilsCrossed className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-white">FoodKasir</h1>
                <p className="text-sm text-orange-50 opacity-90">Sistem Kasir Modern</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {transactions.length > 0 && isAdmin && (
                <div className="hidden sm:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <BarChart3 className="h-4 w-4" />
                  <div className="text-sm">
                    <div className="text-orange-50 opacity-75">Total Penjualan</div>
                    <div className="font-semibold">
                      Rp {transactions.reduce((sum, t) => sum + t.total, 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <User className="h-4 w-4" />
                <div className="text-sm">
                  <div className="text-orange-50 opacity-75">
                    {user?.email ?? "User"}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${isAdmin ? 'bg-orange-200 text-orange-900' : 'bg-blue-200 text-blue-900'}`}
                  >
                    {isAdmin ? 'Admin' : 'Staff Kasir'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="order" className="space-y-6">
          <TabsList className="bg-white shadow-sm border w-full sm:w-auto">
            <TabsTrigger value="order" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Receipt className="h-4 w-4" />
              Pemesanan
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="sales" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4" />
                Riwayat
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="order">
            <div className="pb-24">
              {isAdmin && (
                <div className="flex justify-end mb-4">
                  <AddMenuDialog onAddMenu={handleAddMenu} />
                </div>
              )}
              <FoodMenu items={foodItems} onAddToCart={handleAddToCart} />
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="sales">
              <SalesHistory transactions={transactions} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <FloatingCartButton 
        itemCount={totalItems}
        total={totalPrice}
        onClick={() => setCartOpen(true)}
      />

      <CartDrawer
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        open={cartOpen}
        onOpenChange={setCartOpen}
      />

      {/* TAMBAHAN: Payment Dialog Component */}
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        items={cartItems}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./components/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppWithAuth />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppWithAuth() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4 animate-pulse">
            <UtensilsCrossed className="h-10 w-10 text-white" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
 
  if (!user) {
    return <Login />;
  }

  return <DashboardContent />;
}