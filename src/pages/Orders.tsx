import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Order } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Orders: React.FC = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<{ data: Order[]; total: number}>({
    queryKey: ['orders'],
    queryFn: () => apiService.getOrders(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  const orders: Order[] = data?.data || [];

  const getStatusKey = (status: Order['status']): string => status.toLowerCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('orders.title')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('orders.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t('common.noData')}</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">{t('orders.orderNumber')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('orders.customer')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.amount')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.status')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>{o.userId}</TableCell>
                      <TableCell>{o.totalAmount.toLocaleString('fa-IR')} تومان</TableCell>
                      <TableCell>
                        <Badge>
                          {t(`orders.${getStatusKey(o.status)}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(o.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;


