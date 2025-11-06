import { useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { OrderItem } from "@/types/order";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const ClientOrder = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleAddOrder = async (items: OrderItem[]) => {
    if (!customerName.trim()) {
      toast.error("Por favor, insira seu nome");
      return;
    }

    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderNumber = `${Date.now().toString().slice(-6)}`;

    try {
      const { error } = await supabase.from("orders").insert([{
        order_number: orderNumber,
        items: items as any,
        total: total,
        status: "pending",
        customer_name: customerName,
        customer_phone: customerPhone || null,
      }]);

      if (error) throw error;

      toast.success("Pedido enviado com sucesso!");
      setOrderSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setOrderSubmitted(false);
        setCustomerName("");
        setCustomerPhone("");
      }, 3000);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido. Tente novamente.");
    }
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pedido Enviado!</h2>
          <p className="text-muted-foreground">
            Seu pedido foi recebido e está sendo preparado.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Fazer Pedido</h1>
              <p className="text-sm text-muted-foreground">
                Crie seu pedido e envie para a cozinha
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Customer Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Seus Dados</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </Card>

        {/* Order Form */}
        <OrderForm onAddOrder={handleAddOrder} />
      </main>
    </div>
  );
};

export default ClientOrder;
