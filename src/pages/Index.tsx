import { Home, Printer, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sistema ESC/POS</h1>
              <p className="text-sm text-muted-foreground">
                Escolha sua área de acesso
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Area */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/pedido")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <UtensilsCrossed className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Área do Cliente</CardTitle>
              <CardDescription>
                Faça seu pedido diretamente pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>✓ Criar novo pedido</li>
                <li>✓ Adicionar itens</li>
                <li>✓ Enviar para cozinha</li>
              </ul>
              <Button className="w-full" size="lg">
                Fazer Pedido
              </Button>
            </CardContent>
          </Card>

          {/* Admin Area */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin")}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Printer className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Área Admin</CardTitle>
              <CardDescription>
                Gerencie e imprima os pedidos recebidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>✓ Ver pedidos em tempo real</li>
                <li>✓ Imprimir comprovantes</li>
                <li>✓ Gerenciar status</li>
              </ul>
              <Button className="w-full" size="lg" variant="secondary">
                Acessar Painel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto p-6 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-3 text-lg">ℹ️ Informações do Sistema</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Cliente:</strong> Crie pedidos e envie automaticamente para o admin</li>
            <li>• <strong>Admin:</strong> Receba pedidos em tempo real e imprima via ESC/POS</li>
            <li>• <strong>Android:</strong> Requer ESC/POS USB Print Service instalado</li>
            <li>• <strong>Outros dispositivos:</strong> Preview de impressão padrão</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Index;
