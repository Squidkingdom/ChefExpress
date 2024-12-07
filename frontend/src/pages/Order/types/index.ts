export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    amazonLink: string;
    rating?: number;
    reviews?: number;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }