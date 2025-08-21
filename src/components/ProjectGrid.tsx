import { GitHubProject } from '@/types/github';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';

interface ProjectGridProps {
  projects: GitHubProject[];
  isLoading: boolean;
}

// 骨架屏组件
const ProjectCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

export function ProjectGrid({ projects, isLoading }: ProjectGridProps) {
  // 加载状态显示骨架屏
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  // 无项目时显示
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-search text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到项目</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          没有找到符合当前筛选条件的项目，请尝试调整搜索条件或时间范围。
        </p>
      </div>
    );
  }
  
  // 正常显示项目网格
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 * (project.id.length % 10) }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}