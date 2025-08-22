import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useTranslation();

  // Check if mobile view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mobile backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 z-30 h-full transition-transform duration-300",
        // Desktop behavior
        "md:translate-x-0",
        // Mobile behavior
        isMobile && !isMobileMenuOpen && "translate-x-full",
        isMobile && isMobileMenuOpen && "translate-x-0"
      )}>
        <Sidebar 
          isCollapsed={isMobile ? false : isSidebarCollapsed} 
          onToggle={toggleSidebar}
          isMobile={isMobile}
          onItemClick={isMobile ? closeMobileMenu : undefined}
        />
      </div>
      
      {/* Main content */}
      <div className={cn(
        "min-h-screen flex flex-col transition-all duration-300",
        // Desktop padding
        !isMobile && (isSidebarCollapsed ? "pr-16" : "pr-64"),
        // Mobile full width
        isMobile && "pr-0"
      )}>
        <Header onMenuClick={toggleSidebar} isMobile={isMobile} />
        <main className="flex-1 p-3 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;