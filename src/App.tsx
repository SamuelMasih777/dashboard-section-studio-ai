import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SectionsPage } from './pages/SectionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { TagsPage } from './pages/TagsPage';
import { BundlesPage } from './pages/BundlesPage';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="sections" element={<SectionsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="bundles" element={<BundlesPage />} />
          <Route
            path="settings"
            element={
            <div className="p-8 text-center text-muted-foreground">
                Settings page coming soon
              </div>
            } />
          
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>);

}