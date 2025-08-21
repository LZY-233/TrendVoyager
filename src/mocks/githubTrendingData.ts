import { GitHubProject } from '@/types/github';

// 浏览历史记录功能保留，其余模拟数据功能已由真实API替代

// 获取浏览历史
export const getBrowsingHistory = (): GitHubProject['fullName'][] => {
  const history = localStorage.getItem('githubTrendingHistory');
  return history ? JSON.parse(history) : [];
};

// 添加浏览历史
export const addToBrowsingHistory = (projectFullName: GitHubProject['fullName']) => {
  const history = getBrowsingHistory();
  const newHistory = [projectFullName, ...history.filter(item => item !== projectFullName)].slice(0, 10);
  localStorage.setItem('githubTrendingHistory', JSON.stringify(newHistory));
};