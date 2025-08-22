import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';


const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  useTranslation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar - Fixed to right */}
      <div className="fixed top-0 right-0 z-10 h-full">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      </div>
      
      {/* Main content with padding for sidebar */}
      <div className={cn(
        "min-h-screen flex flex-col transition-all duration-300",
        isSidebarCollapsed ? "pr-16" : "pr-64"
      )}>
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;