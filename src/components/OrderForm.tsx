import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Package } from "lucide-react";
import { OrderItem } from "@/types/order";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  size: string | null;
  price: number;
  category: string | null;
  stock: number;
}

interface OrderFormProps {
  onAddOrder: (items: OrderItem[]) => void;
}

export const OrderForm = ({ onAddOrder }: OrderFormProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!selectedProductId) {
      toast.error("Selecione um produto");
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const quantity = parseInt(itemQuantity) || 1;

    // Check if product already in cart
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      setItems(items.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        id: product.id,
        name: `${product.name}${product.color ? ` (${product.color})` : ""}${product.size ? ` - ${product.size}` : ""}`,
        quantity: quantity,
        price: product.price,
      };
      setItems([...items, newItem]);
    }

    setSelectedProductId("");
    setItemQuantity("1");
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (items.length === 0) return;
    onAddOrder(items);
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-2xl">Criar Novo Pedido</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando produtos...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">
              Nenhum produto disponível no momento
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product">Selecione o Produto</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Escolha um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.color && `Cor: ${product.color}`}
                            {product.color && product.size && " • "}
                            {product.size && `Tamanho: ${product.size}`}
                            {(product.color || product.size) && " • "}
                            R$ {product.price.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemQuantity">Quantidade</Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addItem} className="w-full" size="lg" disabled={!selectedProductId}>
              <Plus className="mr-2 h-5 w-5" />
              Adicionar ao Pedido
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity}x R$ {item.price.toFixed(2)} = R${" "}
                      {(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">R$ {total.toFixed(2)}</span>
            </div>

            <Button onClick={handleSubmit} className="w-full" size="lg" variant="default">
              Criar Pedido
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
