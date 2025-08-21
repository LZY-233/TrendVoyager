import { GitHubProject, GitHubTrendingResponse, TimeRange } from '@/types/github';
import { toast } from 'sonner';

// 编程语言颜色映射
const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#306998',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#ffac45',
  Kotlin: '#f18e33',
  Dart: '#00b4ab',
  Scala: '#c22d40',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  React: '#61dafb',
  Angular: '#dd0031',
  Svelte: '#ff3e00',
};

// 获取语言对应的颜色
const getLanguageColor = (language?: string): string => {
  if (!language) return '#888888';
  return languageColors[language] || '#888888';
};

// 生成时间范围查询字符串
const getTimeRangeQuery = (timeRange: TimeRange): string => {
  const date = new Date();
  switch (timeRange) {
    case 'daily':
      date.setDate(date.getDate() - 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() - 7);
      break;
    case 'monthly':
      date.setDate(date.getDate() - 30);
      break;
  }
  return date.toISOString().split('T')[0];
};

// 模拟生成趋势数据
const generateTrendData = (stars: number): { date: string; stars: number }[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const variation = Math.floor(Math.random() * 50);
    return {
      date: date.toISOString().split('T')[0],
      stars: Math.max(1, stars - variation + Math.floor(i * (variation / 6))),
    };
  });
};

// 从GitHub API获取趋势数据
export const fetchGitHubTrending = async (
  timeRange: TimeRange = 'daily',
  language?: string
): Promise<GitHubTrendingResponse> => {
  // 检查缓存
  const cacheKey = `github_trending_${timeRange}_${language || 'all'}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    // 缓存有效期1小时
    if (Date.now() - parsedData.timestamp < 3600000) {
      return parsedData.data;
    }
  }

  const sinceDate = getTimeRangeQuery(timeRange);
  const languageQuery = language ? `+language:${language}` : '';
  
  // 使用GitHub Search API模拟趋势数据
  const searchQuery = `created:>${sinceDate}${languageQuery}`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=30`;
  
  try {
    setIsLoading(true);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    
    if (!response.ok) {
      if (response.status === 403) {
        toast.error('GitHub API请求受限，请稍后再试或添加认证令牌');
      } else {
        toast.error(`获取数据失败: ${response.statusText}`);
      }
      throw new Error(`GitHub API请求失败: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 转换API响应为项目格式
    const projects: GitHubProject[] = data.items.map((item: any) => {
      const trendData = generateTrendData(item.stargazers_count);
      const yesterdayStars = trendData[trendData.length - 2]?.stars || 0;
      
      return {
        id: item.id.toString(),
        name: item.name,
        fullName: item.full_name,
        description: item.description || 'No description available',
        author: item.owner.login,
        avatarUrl: item.owner.avatar_url,
        stars: item.stargazers_count,
        starsToday: Math.max(0, item.stargazers_count - yesterdayStars),
        forks: item.forks_count,
        language: item.language || 'Unknown',
        languageColor: getLanguageColor(item.language),
        url: item.html_url,
        trendData,
      };
    });
    
    // 获取可用语言列表
    const languages = Array.from(
      new Set(projects.map(p => p.language).filter(lang => lang !== 'Unknown'))
    ).sort();
    
    const result: GitHubTrendingResponse = {
      projects,
      languages,
      lastFetched: new Date(),
    };
    
    // 缓存结果
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: result
    }));
    
    return result;
  } catch (error) {
    console.error('获取GitHub趋势数据失败:', error);
    // 如果有缓存数据，使用缓存数据回退
    if (cachedData) {
      toast.info('使用缓存数据，可能不是最新的');
      return JSON.parse(cachedData).data;
    }
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// 临时变量用于管理加载状态
let isLoading = false;
const setIsLoading = (state: boolean) => {
  isLoading = state;
}