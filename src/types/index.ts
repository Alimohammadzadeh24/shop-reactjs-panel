// Core interface definitions
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PRIMARY_INVENTOR' | 'SECONDARY_INVENTOR';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: any;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  minThreshold: number;
  lastUpdated: Date;
  isLowStock?: boolean;
  product?: Product;
}

export interface Return {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  refundAmount: number;
  createdAt: Date;
  updatedAt: Date;
  order?: Order;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  isActive?: boolean;
}

export interface OrderQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  pendingReturns: number;
  recentOrders: Order[];
  salesTrend: Array<{
    date: string;
    amount: number;
  }>;
}