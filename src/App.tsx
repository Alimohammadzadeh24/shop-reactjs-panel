import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import LoginPage from '@/components/Auth/LoginPage';
import Dashboard from '@/pages/Dashboard';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold">صفحه محصولات</h2>
                      <p className="text-muted-foreground mt-2">این صفحه در حال توسعه می‌باشد</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Orders - All roles with different permissions */}
              <Route 
                path="orders" 
                element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">صفحه سفارشات</h2>
                    <p className="text-muted-foreground mt-2">این صفحه در حال توسعه می‌باشد</p>
                  </div>
                } 
              />
              
              {/* Inventory - All roles */}
              <Route 
                path="inventory" 
                element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">صفحه انبار</h2>
                    <p className="text-muted-foreground mt-2">این صفحه در حال توسعه می‌باشد</p>
                  </div>
                } 
              />
              
              {/* Returns - Admin + Primary Inventor */}
              <Route 
                path="returns" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PRIMARY_INVENTOR']}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold">صفحه مرجوعات</h2>
                      <p className="text-muted-foreground mt-2">این صفحه در حال توسعه می‌باشد</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Users - Admin only */}
              <Route 
                path="users" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold">صفحه کاربران</h2>
                      <p className="text-muted-foreground mt-2">این صفحه در حال توسعه می‌باشد</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Settings - All roles */}
              <Route 
                path="settings" 
                element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">صفحه تنظیمات</h2>
                    <p className="text-muted-foreground mt-2">این صفحه در حال توسعه می‌باشد</p>
                  </div>
                } 
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