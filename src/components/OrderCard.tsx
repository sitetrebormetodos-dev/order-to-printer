import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Eye } from "lucide-react";
import { Order } from "@/types/order";
import { printOrder, generateReceiptHTML } from "@/utils/printUtils";
import { useState } from "react";
import { toast } from "sonner";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [copies, setCopies] = useState(1);

  const handlePrint = () => {
    const success = printOrder(order, copies);
    if (success) {
      toast.success(`Comando de impressão enviado! ${copies} ${copies === 1 ? 'cópia' : 'cópias'}`);
    } else {
      toast.error("Erro ao enviar comando de impressão");
    }
  };

  const handlePreview = () => {
    const html = generateReceiptHTML(order);
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  };

  return (
    <Card className="border-2 shadow-md hover:shadow-xl transition-shadow">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Pedido #{order.orderNumber}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {new Date(order.date).toLocaleString("pt-BR")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm py-2 border-b">
              <span className="font-medium truncate flex-1 min-w-0">{item.name}</span>
              <div className="flex gap-4 text-muted-foreground shrink-0">
                <span>{item.quantity}x</span>
                <span>R$ {item.price.toFixed(2)}</span>
                <span className="font-semibold text-foreground">
                  R$ {(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-primary">
            R$ {order.total.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Cópias:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={copies}
            onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border rounded text-center"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handlePrint} className="flex-1" size="lg">
            <Printer className="mr-2 h-5 w-5" />
            Imprimir
          </Button>
          <Button onClick={handlePreview} variant="outline" size="lg">
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
