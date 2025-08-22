import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { User } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Users: React.FC = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  const users: User[] = data || [];

  const getRoleDisplay = (role: User['role']): string => {
    switch (role) {
      case 'ADMIN':
        return t('users.admin');
      case 'PRIMARY_INVENTOR':
        return t('users.primaryInventor');
      case 'SECONDARY_INVENTOR':
        return t('users.secondaryInventor');
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('users.title')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('users.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">{t('common.noData')}</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">{t('common.name')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.email')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('users.role')}</TableHead>
                    <TableHead className="whitespace-nowrap">{t('common.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{`${u.firstName} ${u.lastName}`}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{getRoleDisplay(u.role)}</TableCell>
                      <TableCell>{u.isActive ? t('common.active') : t('common.inactive')}</TableCell>
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

export default Users;


