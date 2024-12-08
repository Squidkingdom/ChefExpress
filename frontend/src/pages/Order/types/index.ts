export interface Product {
  id: number;
  name: string;
  price: string;
  URL: string;
  quantity: string;
  category: string;
  img: string;
  rating?: number;
  reviews?: number;
  description?: string;
}

// Omit the quantity from Product and add it as a number for CartItem
export interface CartItem extends Omit<Product, 'quantity'> {
  quantity: number;
}