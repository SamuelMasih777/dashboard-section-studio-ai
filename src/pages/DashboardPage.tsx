import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  LayersIcon,
  TagIcon,
  FolderIcon,
  PackageIcon,
  TrendingUpIcon,
  UsersIcon } from
'lucide-react';
import {
  mockSections,
  mockCategories,
  mockTags,
  mockBundles } from
'../lib/mockData';
export function DashboardPage() {
  const stats = [
  {
    title: 'Total Sections',
    value: mockSections.length,
    icon: LayersIcon,
    trend: '+12%',
    trendUp: true
  },
  {
    title: 'Categories',
    value: mockCategories.length,
    icon: FolderIcon,
    trend: '+2',
    trendUp: true
  },
  {
    title: 'Active Tags',
    value: mockTags.length,
    icon: TagIcon,
    trend: '0',
    trendUp: true
  },
  {
    title: 'Bundles',
    value: mockBundles.length,
    icon: PackageIcon,
    trend: '+1',
    trendUp: true
  }];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back to Section Studio AI. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) =>
        <Card
          key={stat.title}
          className="glass-hover transition-all duration-300">
          
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUpIcon
                className={`w-4 h-4 mr-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
              
                <span
                className={
                stat.trendUp ?
                'text-green-500 font-medium' :
                'text-red-500 font-medium'
                }>
                
                  {stat.trend}
                </span>
                <span className="text-muted-foreground ml-2">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSections.slice(0, 4).map((section) =>
              <div
                key={section.id}
                className="flex items-center p-3 rounded-xl hover:bg-muted/50 transition-colors">
                
                  <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {section.thumbnailUrl ?
                  <img
                    src={section.thumbnailUrl}
                    alt={section.title}
                    className="w-full h-full object-cover" /> :


                  <div className="w-full h-full flex items-center justify-center">
                        <LayersIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                  }
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-sm">{section.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {section.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      ${(section.price / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCategories.slice(0, 5).map((category) => {
                const count = mockSections.filter(
                  (s) => s.category === category.handle
                ).length;
                return (
                  <div
                    key={category.handle}
                    className="flex items-center justify-between p-2">
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.emoji}</span>
                      <span className="font-medium text-sm">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {count} sections
                    </span>
                  </div>);

              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}