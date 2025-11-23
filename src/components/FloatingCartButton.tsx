import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, ChevronUp } from "lucide-react";
import { motion } from "motion/react";

interface FloatingCartButtonProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export function FloatingCartButton({ itemCount, total, onClick }: FloatingCartButtonProps) {
  if (itemCount === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-0 right-0 z-50 px-4 max-w-2xl mx-auto"
    >
      <Button
        onClick={onClick}
        className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-2xl hover:shadow-orange-500/50 flex items-center justify-between px-6 rounded-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="relative bg-white/20 p-2 rounded-xl">
            <ShoppingCart className="h-5 w-5" />
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-white text-orange-600 border-2 border-orange-500 font-semibold"
            >
              {itemCount}
            </Badge>
          </div>
          <div className="text-left">
            <p className="text-xs text-orange-50 opacity-90">Keranjang</p>
            <p className="text-sm">{itemCount} Item</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-orange-50 opacity-90">Total</p>
            <p className="font-semibold">Rp {total.toLocaleString('id-ID')}</p>
          </div>
          <ChevronUp className="h-5 w-5 animate-bounce" />
        </div>
      </Button>
    </motion.div>
  );
}
