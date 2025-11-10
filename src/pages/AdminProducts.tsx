import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  size: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  is_active: boolean;
  base: string | null;
  meio_a_meio: string | null;
  frutas: string | null;
  mix_ins: string | null;
  toppings: string | null;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "",
    size: "",
    price: "",
    image_url: "",
    category: "",
    stock: "0",
    is_active: true,
    base: "",
    meio_a_meio: "",
    frutas: "",
    mix_ins: "",
    toppings: "",
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "",
      size: "",
      price: "",
      image_url: "",
      category: "",
      stock: "0",
      is_active: true,
      base: "",
      meio_a_meio: "",
      frutas: "",
      mix_ins: "",
      toppings: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        color: formData.color || null,
        size: formData.size || null,
        price: parseFloat(formData.price),
        image_url: formData.image_url || null,
        category: formData.category || null,
        stock: parseInt(formData.stock) || 0,
        is_active: formData.is_active,
        base: formData.base || null,
        meio_a_meio: formData.meio_a_meio || null,
        frutas: formData.frutas || null,
        mix_ins: formData.mix_ins || null,
        toppings: formData.toppings || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Produto atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast.success("Produto criado com sucesso!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Erro ao salvar produto");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      color: product.color || "",
      size: product.size || "",
      price: product.price.toString(),
      image_url: product.image_url || "",
      category: product.category || "",
      stock: product.stock.toString(),
      is_active: product.is_active,
      base: product.base || "",
      meio_a_meio: product.meio_a_meio || "",
      frutas: product.frutas || "",
      mix_ins: product.mix_ins || "",
      toppings: product.toppings || "",
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Produto excluído com sucesso!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
                <p className="text-sm text-muted-foreground">
                  Cadastre produtos para os clientes selecionarem
                </p>
              </div>
            </div>
            <Button onClick={fetchProducts} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Editar Produto" : "Novo Produto"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Pizza Margherita"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="Ex: Vermelha"
                    />
                  </div>

                  <div>
                    <Label htmlFor="size">Tamanho</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="Ex: Grande"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Pizzas"
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Detalhes do Item (Opcional)</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="base">Base</Label>
                      <Input
                        id="base"
                        value={formData.base}
                        onChange={(e) => setFormData({ ...formData, base: e.target.value })}
                        placeholder="Ex: Cupuaçu, Açaí"
                      />
                    </div>

                    <div>
                      <Label htmlFor="meio_a_meio">Meio a Meio</Label>
                      <Input
                        id="meio_a_meio"
                        value={formData.meio_a_meio}
                        onChange={(e) => setFormData({ ...formData, meio_a_meio: e.target.value })}
                        placeholder="Ex: Creme, Flocos"
                      />
                    </div>

                    <div>
                      <Label htmlFor="frutas">Frutas (F:)</Label>
                      <Textarea
                        id="frutas"
                        value={formData.frutas}
                        onChange={(e) => setFormData({ ...formData, frutas: e.target.value })}
                        placeholder="Ex: Abacaxi, Banana, Manga, Chocolate"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="mix_ins">Mix-ins (M:)</Label>
                      <Textarea
                        id="mix_ins"
                        value={formData.mix_ins}
                        onChange={(e) => setFormData({ ...formData, mix_ins: e.target.value })}
                        placeholder="Ex: Manga, Uva, Chocolate, Mel"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="toppings">Toppings (T:)</Label>
                      <Textarea
                        id="toppings"
                        value={formData.toppings}
                        onChange={(e) => setFormData({ ...formData, toppings: e.target.value })}
                        placeholder="Ex: Manga, Melão, Morango, Uva"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Produto Ativo</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="mr-2 h-4 w-4" />
                    {editingId ? "Atualizar" : "Criar"} Produto
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              Produtos Cadastrados ({products.length})
            </h2>
            
            {loading ? (
              <p className="text-muted-foreground">Carregando...</p>
            ) : products.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  Nenhum produto cadastrado ainda
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <Card key={product.id} className={!product.is_active ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2 text-sm">
                            {product.color && (
                              <span className="px-2 py-1 bg-muted rounded truncate max-w-[150px]">Cor: {product.color}</span>
                            )}
                            {product.size && (
                              <span className="px-2 py-1 bg-muted rounded truncate max-w-[150px]">Tamanho: {product.size}</span>
                            )}
                            {product.category && (
                              <span className="px-2 py-1 bg-muted rounded truncate max-w-[150px]">{product.category}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xl font-bold text-primary">
                              R$ {product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Estoque: {product.stock}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;