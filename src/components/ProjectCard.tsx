import { useState } from 'react';
import { GitHubProject } from '@/types/github';
import { addToBrowsingHistory } from '@/mocks/githubTrendingData';
import { TrendChart } from './TrendChart';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: GitHubProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };
  
  const handleCardClick = (e: React.MouseEvent, projectUrl: string) => {
    // 如果点击的是展开/折叠按钮，不跳转
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // 添加到浏览历史
    addToBrowsingHistory(project.fullName);
    
    // 在新窗口打开GitHub链接
    window.open(projectUrl, '_blank');
  };
  
  return (
    <motion.div
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      onClick={(e) => handleCardClick(e, project.url)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {project.author}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={showDetails ? "收起详情" : "展开详情"}
          >
            <i className={`fa-solid ${showDetails ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <i className="fa-solid fa-star mr-1 text-yellow-500"></i>
            {formatNumber(project.stars)}
          </span>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <i className={`fa-solid fa-code mr-1`}></i>
            <span className="flex items-center">
              <span 
                className="w-2 h-2 rounded-full mr-1.5" 
                style={{ backgroundColor: project.languageColor }}
              ></span>
              {project.language}
            </span>
          </span>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            project.starsToday > project.trendData[project.trendData.length - 2]?.stars ? 
            'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
            'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <i className={`fa-solid ${
              project.starsToday > project.trendData[project.trendData.length - 2]?.stars ? 
              'fa-arrow-up mr-1' : 'fa-arrow-down mr-1'
            }`}></i>
            {formatNumber(Math.abs(project.starsToday - (project.trendData[project.trendData.length - 2]?.stars || 0)))}
          </span>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">星标趋势</h4>
            <TrendChart trendData={project.trendData} />
          </div>
        )}
      </div>
    </motion.div>
  );
}