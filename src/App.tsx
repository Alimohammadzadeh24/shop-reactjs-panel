import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import LoginPage from '@/components/Auth/LoginPage';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Inventory from '@/pages/Inventory';
import Returns from '@/pages/Returns';
import Users from '@/pages/Users';
import Settings from '@/pages/Settings';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

function App() {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } 
            />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Products - Admin + Primary Inventor */}
              <Route 
                path="products" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PRIMARY_INVENTOR']}>
                    <Products />
                  </ProtectedRoute>
                } 
              />
              
              {/* Orders - All roles with different permissions */}
              <Route 
                path="orders" 
                element={<Orders />} 
              />
              
              {/* Inventory - All roles */}
              <Route 
                path="inventory" 
                element={<Inventory />} 
              />
              
              {/* Returns - Admin + Primary Inventor */}
              <Route 
                path="returns" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PRIMARY_INVENTOR']}>
                    <Returns />
                  </ProtectedRoute>
                } 
              />
              
              {/* Users - Admin only */}
              <Route 
                path="users" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              
              {/* Settings - All roles */}
              <Route 
                path="settings" 
                element={<Settings />} 
              />
            </Route>
          </Routes>
          
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                fontFamily: 'system-ui, -apple-system, sans-serif',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;