import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, UtensilsCrossed, Coffee, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface FoodMenuProps {
  items: FoodItem[];
  onAddToCart: (item: FoodItem) => void;
}

export function FoodMenu({ items, onAddToCart }: FoodMenuProps) {
  const [activeTab, setActiveTab] = useState<string>("makanan");
  
  const foodItems = items.filter(item => item.category === "Makanan Utama");
  const drinkItems = items.filter(item => item.category === "Minuman");

  const renderItems = (categoryItems: FoodItem[]) => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {categoryItems.map(item => (
        <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border bg-white">
          <div className="relative">
            <div className="aspect-[4/3] relative bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden rounded-t-lg">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {!item.available && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm px-3 py-1">Habis</Badge>
                </div>
              )}
            </div>
            {item.available && (
              <Button
                size="icon"
                onClick={() => onAddToCart(item)}
                className="absolute bottom-2 right-2 h-9 w-9 rounded-lg bg-orange-500 hover:bg-orange-600 shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="p-3 space-y-1">
            <h4 className="line-clamp-1 text-sm sm:text-base">{item.name}</h4>
            <p className="text-orange-600 font-semibold text-sm sm:text-base">
              Rp{item.price.toLocaleString('id-ID')}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6" />
          <h2 className="text-white">Menu Hari Ini</h2>
        </div>
        <p className="text-orange-50">Pilih menu favorit Anda dan tambahkan ke keranjang</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full sm:w-auto bg-white shadow-md border-2">
          <TabsTrigger 
            value="makanan" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Makanan
            <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700 border-0">
              {foodItems.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="minuman" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          >
            <Coffee className="h-4 w-4" />
            Minuman
            <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-700 border-0">
              {drinkItems.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="makanan">
          {foodItems.length === 0 ? (
            <div className="text-center py-20">
              <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-gray-500 mb-2">Tidak ada makanan tersedia</h3>
              <p className="text-sm text-gray-400">Menu akan segera ditambahkan</p>
            </div>
          ) : (
            renderItems(foodItems)
          )}
        </TabsContent>

        <TabsContent value="minuman">
          {drinkItems.length === 0 ? (
            <div className="text-center py-20">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-gray-500 mb-2">Tidak ada minuman tersedia</h3>
              <p className="text-sm text-gray-400">Menu akan segera ditambahkan</p>
            </div>
          ) : (
            renderItems(drinkItems)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
