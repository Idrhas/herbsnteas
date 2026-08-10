export type ProductCategory = "herbal-tea" | "other-tea" | "gift-set" | "accessory";

export interface ProductVariant {
  size: string;
  weight: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  teaType?: string;
  description: string;
  origin: string;
  ingredients: string;
  brewingInstructions?: string;
  price: number | null;
  currency: string;
  inStock: boolean;
  featured: boolean;
  imageUrl: string;
  variants: ProductVariant[];
  tags: string[];
}
