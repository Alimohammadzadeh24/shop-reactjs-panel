import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, LogOut, User, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const isRTL = i18n.language === 'fa';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  const getRoleDisplay = (role: string) => {
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
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">
            {t('dashboard.welcome')}, {user?.firstName}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'fa' ? 'EN' : 'فا'}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "text-left",
                  isRTL && "text-right"
                )}>
                  <div className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRoleDisplay(user?.role || '')}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>پروفایل</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('common.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;