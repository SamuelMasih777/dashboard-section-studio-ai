import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  LayersIcon,
  TagIcon,
  FolderIcon,
  PackageIcon,
  TrendingUpIcon,
  Loader2 } from
'lucide-react';
import { 
  getStatsSummary, 
  getRecentSections, 
  getTopCategories,
  StatsSummary,
  RecentSection,
  TopCategory
} from '../api/stats';

export function DashboardPage() {
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [recentSections, setRecentSections] = useState<RecentSection[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryRes, recentRes, topRes] = await Promise.all([
          getStatsSummary(),
          getRecentSections(),
          getTopCategories()
        ]);

        if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
        if (recentRes.success && recentRes.data) setRecentSections(recentRes.data);
        if (topRes.success && topRes.data) setTopCategories(topRes.data);
        
        if (!summaryRes.success || !recentRes.success || !topRes.success) {
          console.error('Some dashboard data failed to load', { summaryRes, recentRes, topRes });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: 'Total Sections',
      value: summary?.totalSections ?? 0,
      icon: LayersIcon,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Categories',
      value: summary?.totalCategories ?? 0,
      icon: FolderIcon,
      trend: '+2',
      trendUp: true
    },
    {
      title: 'Active Tags',
      value: summary?.totalTags ?? 0,
      icon: TagIcon,
      trend: '0',
      trendUp: true
    },
    {
      title: 'Bundles',
      value: summary?.totalBundles ?? 0,
      icon: PackageIcon,
      trend: '+1',
      trendUp: true
    }
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading dashboard insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to Section Studio. Here's what's happening today.
          </p>
        </div>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) =>
          <Card
            key={stat.title}
            className="glass-hover transition-all duration-300 border-border/50">
            
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
        <Card className="lg:col-span-2 glass border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg">Recent Sections</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentSections.length > 0 ? (
                recentSections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center p-4 hover:bg-muted/50 transition-colors group">
                    
                    <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border/50 group-hover:border-primary/30 transition-colors">
                      {section.thumbnailUrl ? (
                        <img
                          src={section.thumbnailUrl}
                          alt={section.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <LayersIcon className="w-5 h-5 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{section.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {section.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        ${(section.price / 100).toFixed(2)}
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${section.isPublished ? 'text-green-500' : 'text-orange-500'}`}>
                        {section.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground italic">
                  No sections created yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg">Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <div
                    key={category.handle}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    
                    <div className="flex items-center gap-3">
                      <span className="text-2xl drop-shadow-sm">{category.emoji}</span>
                      <span className="font-semibold text-sm">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                      {category.sectionCount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground italic">
                  No categories found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}