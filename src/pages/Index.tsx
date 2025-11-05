import { useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { OrderCard } from "@/components/OrderCard";
import { Order, OrderItem } from "@/types/order";
import { Printer, PackageCheck } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const handleAddOrder = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderNumber = `${Date.now().toString().slice(-6)}`;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date(),
      orderNumber,
    };

    setOrders([newOrder, ...orders]);
    toast.success("Pedido criado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Printer className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Impressão ESC/POS</h1>
              <p className="text-sm text-muted-foreground">
                Teste de impressão via USB Print Service
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <OrderForm onAddOrder={handleAddOrder} />
            
            {/* Info Card */}
            <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <PackageCheck className="h-5 w-5" />
                Como usar:
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Adicione itens ao pedido com nome, quantidade e preço</li>
                <li>• Clique em "Criar Pedido" para gerar o pedido</li>
                <li>• Use o botão "Imprimir" para enviar para a impressora</li>
                <li>• No Android: requer ESC/POS USB Print Service instalado</li>
                <li>• Em outros dispositivos: abrirá preview para impressão</li>
              </ul>
            </div>
          </div>

          {/* Orders Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <PackageCheck className="h-6 w-6 text-primary" />
              Pedidos Criados ({orders.length})
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                <PackageCheck className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Nenhum pedido criado ainda.
                  <br />
                  Crie seu primeiro pedido!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
