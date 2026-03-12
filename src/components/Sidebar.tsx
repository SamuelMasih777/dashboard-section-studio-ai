import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  LayersIcon,
  TagIcon,
  FolderIcon,
  PackageIcon,
  SettingsIcon } from
'lucide-react';
export function Sidebar() {
  const navItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboardIcon
  },
  {
    name: 'Sections',
    path: '/sections',
    icon: LayersIcon
  },
  {
    name: 'Categories',
    path: '/categories',
    icon: FolderIcon
  },
  {
    name: 'Tags',
    path: '/tags',
    icon: TagIcon
  },
  {
    name: 'Bundles',
    path: '/bundles',
    icon: PackageIcon
  }];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col glass-strong border-r border-border min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            SS
          </div>
          <span className="font-bold text-lg tracking-tight">
            Section Studio AI
          </span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Management
        </div>

        {navItems.map((item) =>
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
          }>
          
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
          }>
          
          <SettingsIcon className="w-5 h-5" />
          Settings
        </NavLink>
      </div>
    </aside>);

}