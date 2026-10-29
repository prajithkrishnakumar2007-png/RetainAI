import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutProvider, useLayout } from './context/LayoutContext';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Optimizer from './pages/Optimizer';
import Predict from './pages/Predict';
import Analytics from './pages/Analytics';
import ModelInfo from './pages/ModelInfo';

function AppLayout() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileOpen, setMobileOpen } = useLayout();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-darkbg text-txt-primary font-sans antialiased">
      {/* WCAG 2.2 AA Skip to content link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Main Navigation Sidebar with desktop collapse and mobile drawer */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Dynamic Route Content */}
      <main
        id="main-content"
        className="flex-1 flex flex-col h-full overflow-hidden bg-darkbg focus:outline-none relative"
        tabIndex="-1"
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/optimizer" element={<Optimizer />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/model" element={<ModelInfo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <AppLayout />
      </LayoutProvider>
    </BrowserRouter>
  );
}
