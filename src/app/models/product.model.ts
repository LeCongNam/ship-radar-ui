export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: string;
  isActive: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
