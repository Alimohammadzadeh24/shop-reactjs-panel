import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Edit } from 'lucide-react';
import { apiService } from '@/services/api';
import { Product } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  isActive: boolean;
};

const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data } = useQuery<{ data: Product[]; total: number }>({
    queryKey: ['products', { search }],
    queryFn: () => apiService.getProducts(search ? { search } : undefined),
  });

  const form = useForm<ProductForm>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      isActive: true,
    },
    mode: 'onTouched',
  });

  const { mutateAsync: createProduct, isPending: isSaving } = useMutation({
    mutationFn: async (values: ProductForm) => {
      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price || 0),
        category: values.category,
        brand: values.brand,
        images: [],
        isActive: values.isActive,
      } as Partial<Product>;
      return apiService.createProduct(payload);
    },
    onSuccess: () => {
      toast.success(t('common.save'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', { search }] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error('خطا در ذخیره محصول');
    },
  });

  const { mutateAsync: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: async (values: ProductForm) => {
      if (!editingProduct) throw new Error('No product selected for editing');
      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price || 0),
        category: values.category,
        brand: values.brand,
        isActive: values.isActive,
      } as Partial<Product>;
      return apiService.updateProduct(editingProduct.id, payload);
    },
    onSuccess: () => {
      toast.success(t('common.save'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', { search }] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    },
    onError: () => {
      toast.error('خطا در بروزرسانی محصول');
    },
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      isActive: product.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: ProductForm) => {
    if (!values.name) {
      form.setError('name', { message: t('products.productName') as string });
      return;
    }
    
    if (editingProduct) {
      await updateProduct(values);
    } else {
      await createProduct(values);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  // Do not block on loading/error; show empty state or partial UI instead

  const products: Product[] = data?.data || [];
  const isRTL = useMemo(() => i18n.language === 'fa', [i18n.language]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('products.title')}</h1>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search') as string}
            className={isRTL ? 'text-right' : 'text-left'}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('products.addProduct')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? t('products.editProduct') : t('products.addProduct')}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('products.productName')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('products.productName') as string} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('products.description')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder={t('products.description') as string} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.category')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('common.category') as string} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.brand')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('common.brand') as string} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.price')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              inputMode="numeric"
                              placeholder={t('common.price') as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('common.active')}</FormLabel>
                          <FormControl>
                            <div className="flex items-center h-9">
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={isSaving || isUpdating}>
                      {(isSaving || isUpdating) ? t('common.loading') : t('common.save')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('products.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t('products.noProducts')}</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">{t('products.productName')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.category')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.brand')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.price')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.status')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.brand}</TableCell>
                      <TableCell>{p.price.toLocaleString('fa-IR')} تومان</TableCell>
                      <TableCell>
                        <Badge variant={p.isActive ? 'default' : 'secondary'}>
                          {p.isActive ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
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

export default Products;


