import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  LayersIcon,
  TagIcon,
  FolderIcon,
  PackageIcon,
  SettingsIcon,
  X } from
'lucide-react';
export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
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
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col glass-strong border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              SS
            </div>
            <span className="font-bold text-lg tracking-tight">
              Section Studio
            </span>
          </Link>
          <button onClick={onClose} className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-thin">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Management
        </div>

        {navItems.map((item) =>
        <NavLink
          key={item.name}
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
          }>
          
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        )}
      </div>

      <div className="p-4 border-t border-border shrink-0">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
          }>
          
          <SettingsIcon className="w-5 h-5" />
          Settings
        </NavLink>
      </div>
    </aside>
    </>
  );

}