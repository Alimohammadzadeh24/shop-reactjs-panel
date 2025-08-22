import React from 'react';
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
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobile = false, onItemClick }) => {
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

  const role = user?.role || '';
  const filteredItems = role
    ? navigationItems.filter((item) => item.allowedRoles.includes(role))
    : navigationItems;
  const itemsToShow = filteredItems.length > 0 ? filteredItems : navigationItems;

  return (
    <div className={cn(
      "bg-card border-l border-border transition-all duration-300 flex flex-col h-full",
      // Desktop sizing
      !isMobile && (isCollapsed ? "w-16" : "w-64"),
      // Mobile full width with shadow
      isMobile && "w-64 shadow-xl"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <h2 className="text-lg font-semibold text-foreground">
              پنل مدیریت
            </h2>
          )}
          {!isMobile && (
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
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {itemsToShow.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    !isMobile && isCollapsed && "justify-center"
                  )}
                  title={!isMobile && isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {(!isCollapsed || isMobile) && (
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