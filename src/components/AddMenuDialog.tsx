import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { FoodItem } from "./FoodMenu";

interface AddMenuDialogProps {
  onAddMenu: (item: Omit<FoodItem, "id">) => void;
}

export function AddMenuDialog({ onAddMenu }: AddMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Makanan Utama",
    image: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error("Nama dan harga harus diisi!");
      return;
    }

    const newItem: Omit<FoodItem, "id"> = {
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      available: true,
    };

    onAddMenu(newItem);
    toast.success(`${formData.name} berhasil ditambahkan!`);
    
    // Reset form
    setFormData({
      name: "",
      price: "",
      category: "Makanan Utama",
      image: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Menu Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Menu</Label>
            <Input
              id="name"
              placeholder="Contoh: Nasi Goreng Spesial"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input
              id="price"
              type="number"
              placeholder="25000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Makanan Utama">Makanan Utama</SelectItem>
                <SelectItem value="Minuman">Minuman</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL Gambar (Opsional)</Label>
            <Input
              id="image"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Kosongkan untuk menggunakan gambar default
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Tambah Menu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
