import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Minus, Plus, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  open,
  onOpenChange 
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // PPN 10%
  const total = subtotal + tax;

  const handleCheckout = () => {
    onCheckout();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0 sm:max-w-2xl sm:mx-auto bg-background">
        <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span>Keranjang Belanja</span>
            {items.length > 0 && (
              <Badge className="ml-auto bg-white text-orange-600">
                {items.reduce((sum, item) => sum + item.quantity, 0)} item
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 bg-background">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="bg-orange-50 p-6 rounded-full mb-4">
                <ShoppingBag className="h-16 w-16 text-orange-300" />
              </div>
              <h3 className="text-gray-700 mb-2">Keranjang Masih Kosong</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Yuk, pilih menu favorit kamu dan tambahkan ke keranjang!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  {item.image && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate mb-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-0 border-2 rounded-xl overflow-hidden bg-gray-50">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 hover:bg-orange-50 hover:text-orange-600 rounded-none"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[3rem] text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 hover:bg-orange-50 hover:text-orange-600 rounded-none"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 hover:bg-red-50 hover:text-red-600 rounded-xl"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right self-center">
                    <p className="text-orange-600">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-2 bg-white px-6 py-5 shadow-2xl">
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PPN (10%)</span>
                <span className="font-medium">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-lg">Total Pembayaran</span>
                <div className="text-right">
                  <p className="text-2xl text-orange-600">
                    Rp {total.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheckout} 
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all text-lg rounded-xl"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Checkout Sekarang
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
