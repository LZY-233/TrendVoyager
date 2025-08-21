import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { TimeRange, FilterOptions, GitHubProject } from '@/types/github';
import { fetchGitHubTrending } from '@/services/github';
import { Header } from '@/components/Header';
import { TimeFilter } from '@/components/TimeFilter';
import { ProjectGrid } from '@/components/ProjectGrid';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';

export default function Home() {
  // 状态管理
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<GitHubProject[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useLocalStorage<FilterOptions>('githubTrendingFilters', {});
  
  // 获取GitHub Trending数据
  const fetchTrendingData = async (selectedTimeRange: TimeRange) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchGitHubTrending(selectedTimeRange, filters.language);
      setProjects(data.projects);
      setAvailableLanguages(data.languages);
      
      // 显示API使用提示
      if (!localStorage.getItem('api_notification_shown')) {
        toast.info('数据来自GitHub API，每小时更新一次。未提供认证时可能有请求限制。');
        localStorage.setItem('api_notification_shown', 'true');
      }
    } catch (err) {
      console.error('Failed to fetch GitHub trending data:', err);
      setError('获取数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载和时间范围变化时获取数据
  useEffect(() => {
    fetchTrendingData(timeRange);
  }, [timeRange]);
  
  // 应用搜索和筛选
  useEffect(() => {
    let result = [...projects];
    
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.author.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }
    
    // 语言筛选
    if (filters.language) {
      result = result.filter((project) => project.language === filters.language);
    }
    
    // 排序
    if (filters.sortBy === 'stars') {
      result.sort((a, b) => b.stars - a.stars);
    } else if (filters.sortBy === 'growth') {
      result.sort((a, b) => {
        const aGrowth = a.stars - a.trendData[0].stars;
        const bGrowth = b.stars - b.trendData[0].stars;
        return bGrowth - aGrowth;
      });
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProjects(result);
  }, [projects, searchQuery, filters]);
  
  // 重置筛选条件
  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };
  
  // 检查是否有活跃的筛选条件
  const hasActiveFilters = useMemo(() => {
    return !!(searchQuery || filters.language || filters.sortBy);
  }, [searchQuery, filters]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">热门开源项目</h2>
            <p className="text-gray-500 dark:text-gray-400">
              发现GitHub上正在流行的开源项目
            </p>
          </div>
          
          <TimeFilter
            selectedTimeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isLoading={isLoading}
          />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Filters
              availableLanguages={availableLanguages}
              filters={filters}
              onFilterChange={setFilters}
            />
            
            {hasActiveFilters && (
              <motion.button
                onClick={resetFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <i className="fa-solid fa-times-circle mr-1"></i>
                清除筛选
              </motion.button>
            )}
          </div>
        </div>
        
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">错误: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => fetchTrendingData(timeRange)}
              className="ml-4 text-sm font-medium text-red-800 dark:text-red-400 hover:underline"
            >
              重试
            </button>
          </div>
        ) : (
          <ProjectGrid projects={filteredProjects} isLoading={isLoading} />
        )}
        
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <i className="fa-solid fa-search text-gray-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到匹配项目</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              没有找到符合当前搜索条件的项目，请尝试调整搜索词或筛选条件。
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              清除所有筛选条件
            </button>
          </div>
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} GitHub Trendings 可视化
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <i className="fa-solid fa-github text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <i className="fa-solid fa-info-circle text-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}