export interface ProductVariant {
  id: string;
  label: string;
  quantity: number;
  discountPercent: number;
  unitPrice: number;   // price per unit after discount
  totalPrice: number;  // quantity × unitPrice
}

export interface Ingredient {
  name: string;
  description: string;
  image?: string;       // path to ingredient image
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;   // For intro/sale pricing — shows as strikethrough
  category: 'mental-health' | 'post-treatment';
  image: string;
  ingredients: Ingredient[];
  usage: string;
  size: string;
  variants: ProductVariant[];
  maxQuantity?: number;
  warning?: string[];
  disclaimer?: string[];
}
