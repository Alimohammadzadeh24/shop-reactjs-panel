import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, Edit } from 'lucide-react';
import { apiService } from '@/services/api';
import { Order } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');

  const { data, isLoading } = useQuery<{ data: Order[]; total: number}>({
    queryKey: ['orders'],
    queryFn: () => apiService.getOrders(),
  });

  const { data: orderDetails } = useQuery<Order>({
    queryKey: ['order', selectedOrder?.id],
    queryFn: () => apiService.getOrderById(selectedOrder!.id),
    enabled: !!selectedOrder && isDetailDialogOpen,
  });

  const { mutateAsync: updateOrderStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      return apiService.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      toast.success(t('orders.statusUpdated'));
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsStatusDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    },
    onError: () => {
      toast.error('خطا در بروزرسانی وضعیت سفارش');
    },
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      await updateOrderStatus({ orderId: selectedOrder.id, status: newStatus as Order['status'] });
    }
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const statusOptions: Order['status'][] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

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
                    <TableHead className="whitespace-nowrap">{t('common.actions')}</TableHead>
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(o)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditStatus(o)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('orders.orderDetails')}</DialogTitle>
          </DialogHeader>
          {orderDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('orders.orderNumber')}</label>
                  <p>{orderDetails.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('orders.customer')}</label>
                  <p>{orderDetails.userId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('common.amount')}</label>
                  <p>{orderDetails.totalAmount.toLocaleString('fa-IR')} تومان</p>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('common.status')}</label>
                  <Badge>{t(`orders.${getStatusKey(orderDetails.status)}`)}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">{t('common.date')}</label>
                  <p>{new Date(orderDetails.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>
              
              {orderDetails.shippingAddress && (
                <div>
                  <label className="text-sm font-medium">{t('orders.shippingAddress')}</label>
                  <p className="text-sm text-muted-foreground">{JSON.stringify(orderDetails.shippingAddress)}</p>
                </div>
              )}

              {orderDetails.items && orderDetails.items.length > 0 && (
                <div>
                  <label className="text-sm font-medium">{t('orders.items')}</label>
                  <div className="mt-2 space-y-2">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{item.product?.name || `Product ID: ${item.productId}`}</p>
                          <p className="text-sm text-muted-foreground">{t('common.quantity')}: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{item.price.toLocaleString('fa-IR')} تومان</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDetailDialog}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('orders.editStatus')}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('orders.orderNumber')}</label>
                <p>{selectedOrder.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">{t('orders.currentStatus')}</label>
                <Badge>{t(`orders.${getStatusKey(selectedOrder.status)}`)}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium">{t('orders.newStatus')}</label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('orders.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`orders.${getStatusKey(status)}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseStatusDialog}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus || !newStatus}>
              {isUpdatingStatus ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;


