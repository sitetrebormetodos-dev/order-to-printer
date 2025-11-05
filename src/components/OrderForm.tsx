import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { OrderItem } from "@/types/order";

interface OrderFormProps {
  onAddOrder: (items: OrderItem[]) => void;
}

export const OrderForm = ({ onAddOrder }: OrderFormProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemPrice, setItemPrice] = useState("");

  const addItem = () => {
    if (!itemName || !itemPrice) return;

    const newItem: OrderItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: parseInt(itemQuantity) || 1,
      price: parseFloat(itemPrice) || 0,
    };

    setItems([...items, newItem]);
    setItemName("");
    setItemQuantity("1");
    setItemPrice("");
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Nome do Item</Label>
              <Input
                id="itemName"
                placeholder="Ex: Pizza Margherita"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
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
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Preço (R$)</Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={addItem} className="w-full" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Adicionar Item
          </Button>
        </div>

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
