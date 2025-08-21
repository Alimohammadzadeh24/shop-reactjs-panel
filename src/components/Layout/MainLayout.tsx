import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={cn(
      "min-h-screen bg-background flex",
      isRTL ? "flex-row-reverse" : "flex-row"
    )}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;