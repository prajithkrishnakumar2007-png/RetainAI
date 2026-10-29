import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  Sparkles,
  BarChart3,
  Cpu,
  ChevronLeft,
  ChevronRight,
  X,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { to: '/customers', label: 'Customer Risk', icon: Users, badge: '7,043' },
  { to: '/optimizer', label: 'Retention Optimizer', icon: Target, badge: 'AI' },
  { to: '/predict', label: 'Predict Customer', icon: Sparkles, badge: null },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { to: '/model', label: 'Model Information', icon: Cpu, badge: null },
];

export default function Sidebar({
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-white/10 bg-surface-1 transition-all duration-300 ease-in-out lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-64'}`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
            <NavLink
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
              onClick={() => setMobileOpen && setMobileOpen(false)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-400 border border-brand/30 shadow-inner group-hover:border-brand/50 transition-colors">
                <Layers className="h-5 w-5 text-brand-400" />
              </div>
              {!collapsed && (
                <div className="overflow-hidden transition-opacity">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-base tracking-tight text-white">
                      RETAIN<span className="text-brand-400">AI</span>
                    </span>
                    <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-brand-300 uppercase">
                      Enterprise
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                    Predict · Prioritize · Retain
                  </p>
                </div>
              )}
            </NavLink>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Close navigation drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Navigation List */}
          <nav className="p-3 space-y-1.5 flex-1" aria-label="Primary">
            {!collapsed && (
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Decision Platform
              </p>
            )}

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand/15 text-white border border-brand/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-400 shadow-sm"
                          aria-hidden="true"
                        />
                      )}

                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                        aria-hidden="true"
                      />

                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 overflow-hidden">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                                isActive
                                  ? 'bg-brand/30 text-brand-300'
                                  : 'bg-white/5 text-slate-400 group-hover:text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Desktop Collapse Toggle Footer */}
        <div className="p-3 border-t border-white/10 shrink-0 hidden lg:block">
          <button
            type="button"
            onClick={() => setCollapsed && setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 text-slate-400" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
