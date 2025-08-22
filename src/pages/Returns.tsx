import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const Returns: React.FC = () => {
  const { t } = useTranslation();

  const returnsQuery = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      try {
        const result = await apiService.getReturns();
        // اطمینان از اینکه نتیجه آرایه است
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Returns error:', error);
        // در صورت خطا، آرایه خالی برگردان
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Loading state
  if (returnsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('returns.title')}</h1>
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
  const items = Array.isArray(returnsQuery.data) ? returnsQuery.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('returns.title')}</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">{t('returns.title')}</h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="flex flex-col items-center space-y-3">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p className="text-lg">هنوز مرجوعی ثبت نشده است</p>
              <p className="text-sm text-gray-400">زمانی که مرجوعات ثبت شوند، در اینجا نمایش داده می‌شوند</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={item?.id || index} className="border-b pb-4 last:border-b-0">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <strong>{t('orders.orderNumber')}:</strong>
                    <p>{item?.orderId || 'نامشخص'}</p>
                  </div>
                  <div>
                    <strong>{t('returns.reason')}:</strong>
                    <p>{item?.reason || '-'}</p>
                  </div>
                  <div>
                    <strong>{t('returns.refundAmount')}:</strong>
                    <p>{(item?.refundAmount || 0).toLocaleString('fa-IR')} تومان</p>
                  </div>
                  <div>
                    <strong>{t('common.status')}:</strong>
                    <p>{item?.status || 'نامشخص'}</p>
                  </div>
                  <div>
                    <strong>{t('common.date')}:</strong>
                    <p>{item?.createdAt ? new Date(item.createdAt).toLocaleDateString('fa-IR') : '-'}</p>
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

export default Returns;


