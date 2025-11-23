import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // PPN 10%
  const total = subtotal + tax;

  return (
    <Card className="p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5" />
        <h3>Keranjang Belanja</h3>
        {items.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {items.reduce((sum, item) => sum + item.quantity, 0)} item
          </Badge>
        )}
      </div>

      <Separator className="mb-4" />

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
          <p>Keranjang masih kosong</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="mb-4" />

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>PPN (10%)</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Button onClick={onCheckout} className="w-full">
            Checkout
          </Button>
        </>
      )}
    </Card>
  );
}
