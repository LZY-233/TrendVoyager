import { FilterOptions } from '@/types/github';
import { motion, AnimatePresence } from 'framer-motion';

interface FiltersProps {
  availableLanguages: string[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function Filters({ availableLanguages, filters, onFilterChange }: FiltersProps) {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      language: value === 'all' ? undefined : value,
    });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      sortBy: value === 'default' ? undefined : (value as FilterOptions['sortBy']),
    });
  };
  
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label htmlFor="language-filter" className="sr-only">编程语言</label>
        <select
          id="language-filter"
          value={filters.language || 'all'}
          onChange={handleLanguageChange}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="all">所有语言</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <label htmlFor="sort-filter" className="sr-only">排序方式</label>
        <select
          id="sort-filter"
          value={filters.sortBy || 'default'}
          onChange={handleSortChange}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="default">默认排序</option>
          <option value="stars">星标数</option>
          <option value="growth">增长率</option>
          <option value="name">名称</option>
        </select>
      </motion.div>
    </div>
  );
}