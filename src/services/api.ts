import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginDto, 
  User, 
  Product, 
  Order, 
  Inventory, 
  Return, 
  ProductQueryDto, 
  OrderQueryDto,
  DashboardStats 
} from '@/types';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = localStorage.getItem('token');

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginDto): Promise<{ user: User; accessToken: string }> {
    const response = await this.api.post('/auth/login', credentials);
    this.token = response.data.accessToken;
    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/auth/change-password', { oldPassword, newPassword });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }

  // Users (Admin only)
  async createUser(userData: Partial<User>): Promise<User> {
    const response = await this.api.post('/users', userData);
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.api.patch(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Products
  async getProducts(params?: ProductQueryDto): Promise<{ data: Product[]; total: number }> {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await this.api.patch(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // Orders
  async getOrders(params?: OrderQueryDto): Promise<{ data: Order[]; total: number }> {
    const response = await this.api.get('/orders', { params });
    return response.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await this.api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    const response = await this.api.get('/inventory');
    return response.data;
  }

  async getProductInventory(productId: string): Promise<Inventory> {
    const response = await this.api.get(`/inventory/${productId}`);
    return response.data;
  }

  async updateStock(productId: string, quantity: number): Promise<Inventory> {
    const response = await this.api.patch(`/inventory/${productId}`, { quantity });
    return response.data;
  }

  // Returns
  async getReturns(): Promise<Return[]> {
    const response = await this.api.get('/returns');
    return response.data;
  }

  async getReturnById(id: string): Promise<Return> {
    const response = await this.api.get(`/returns/${id}`);
    return response.data;
  }

  async createReturn(returnData: Partial<Return>): Promise<Return> {
    const response = await this.api.post('/returns', returnData);
    return response.data;
  }

  async updateReturnStatus(id: string, status: Return['status']): Promise<Return> {
    const response = await this.api.patch(`/returns/${id}/status`, { status });
    return response.data;
  }
}

export const apiService = new ApiService();