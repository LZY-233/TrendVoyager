import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showClearButton, setShowClearButton] = useState(!!searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  
  // 当外部搜索查询变化时更新本地状态
  useEffect(() => {
    setLocalSearch(searchQuery);
    setShowClearButton(!!searchQuery);
  }, [searchQuery]);
  
  // 防抖处理搜索输入
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [localSearch, onSearchChange]);
  
  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };
  
  return (
    <motion.div
      className="relative w-full max-w-md"
      animate={{
        boxShadow: isFocused 
          ? '0 0 0 2px rgba(59, 130, 246, 0.2)' 
          : '0 0 0 0px rgba(59, 130, 246, 0)'
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fa-solid fa-search text-gray-400"></i>
      </div>
      <input
        type="text"
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value);
          setShowClearButton(!!e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="搜索项目或作者..."
        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm text-gray-900 dark:text-gray-100 transition-all"
      />
      
      {showClearButton && (
        <button
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="清除搜索"
        >
          <i className="fa-solid fa-times-circle"></i>
        </button>
      )}
    </motion.div>
  );
}