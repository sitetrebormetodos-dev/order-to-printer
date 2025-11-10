export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  base?: string;
  meioAMeio?: string;
  frutas?: string;
  mixIns?: string;
  toppings?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: Date;
  orderNumber: string;
}
