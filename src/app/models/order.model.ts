import { Product } from './product.model';
import { Shop } from './shop.model';

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Shipping {
  id: number;
  // Add other shipping fields if necessary
}

export interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt?: string; // DateTime in Prisma becomes string in JSON
  updatedAt?: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;

  noted?: string;

  shopId: string;
  shop?: Shop;
  orderItems: OrderItem[];
  shippings?: Shipping[];
}
