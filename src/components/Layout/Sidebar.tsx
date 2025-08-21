import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  RotateCcw,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuthStore();
  const isRTL = i18n.language === 'fa';

  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['ADMIN', 'PRIMARY_INVENTOR', 'SECONDARY_INVENTOR']
    },
    {
      name: t('navigation.products'),
      href: '/products',
      icon: Package,
      allowedRoles: ['ADMIN', 'PRIMARY_INVENTOR']
    },
    {
      name: t('navigation.orders'),
      href: '/orders',
      icon: ShoppingCart,
      allowedRoles: ['ADMIN', 'PRIMARY_INVENTOR', 'SECONDARY_INVENTOR']
    },
    {
      name: t('navigation.inventory'),
      href: '/inventory',
      icon: Archive,
      allowedRoles: ['ADMIN', 'PRIMARY_INVENTOR', 'SECONDARY_INVENTOR']
    },
    {
      name: t('navigation.returns'),
      href: '/returns',
      icon: RotateCcw,
      allowedRoles: ['ADMIN', 'PRIMARY_INVENTOR']
    },
    {
      name: t('navigation.users'),
      href: '/users',
      icon: Users,
      allowedRoles: ['ADMIN']
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
      allowedRoles: ['ADMIN', 'PRIMARY_INVENTOR', 'SECONDARY_INVENTOR']
    }
  ];

  const filteredItems = navigationItems.filter(item =>
    item.allowedRoles.includes(user?.role || '')
  );

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64",
      isRTL ? "border-l border-r-0" : ""
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">
              پنل مدیریت
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-accent"
          >
            {isCollapsed ? (
              isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;