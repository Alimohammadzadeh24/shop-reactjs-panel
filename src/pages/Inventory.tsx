import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const Inventory: React.FC = () => {
  const { t } = useTranslation();

  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      try {
        const result = await apiService.getInventory();
        // اطمینان از اینکه نتیجه آرایه است
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Inventory error:', error);
        // در صورت خطا، آرایه خالی برگردان
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Loading state
  if (inventoryQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('inventory.title')}</h1>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-center py-12 text-gray-500">
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // اطمینان از اینکه items یک آرایه است
  const items = Array.isArray(inventoryQuery.data) ? inventoryQuery.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('inventory.title')}</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">{t('inventory.title')}</h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="flex flex-col items-center space-y-3">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p className="text-lg">انبار خالی است</p>
              <p className="text-sm text-gray-400">زمانی که کالاها به انبار اضافه شوند، در اینجا نمایش داده می‌شوند</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={item?.id || index} className="border-b pb-4 last:border-b-0">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <strong>{t('products.productName')}:</strong>
                    <p>{item?.product?.name || item?.productId || 'نامشخص'}</p>
                  </div>
                  <div>
                    <strong>{t('inventory.stockLevel')}:</strong>
                    <p>{(item?.quantity || 0).toLocaleString('fa-IR')}</p>
                  </div>
                  <div>
                    <strong>{t('inventory.minThreshold')}:</strong>
                    <p>{(item?.minThreshold || 0).toLocaleString('fa-IR')}</p>
                  </div>
                  <div>
                    <strong>{t('common.status')}:</strong>
                    <p className={(item?.quantity || 0) <= (item?.minThreshold || 0) ? 'text-red-600' : 'text-green-600'}>
                      {(item?.quantity || 0) <= (item?.minThreshold || 0) ? t('inventory.lowStockAlert') : t('common.active')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;


