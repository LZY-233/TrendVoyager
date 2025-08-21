import { TimeRange } from '@/types/github';
import { motion } from 'framer-motion';

interface TimeFilterProps {
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading: boolean;
}

export function TimeFilter({ selectedTimeRange, onTimeRangeChange, isLoading }: TimeFilterProps) {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'daily', label: '今日' },
    { value: 'weekly', label: '本周' },
    { value: 'monthly', label: '本月' },
  ];
  
  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onTimeRangeChange(range.value)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex-1 ${
            selectedTimeRange === range.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <motion.span
            animate={{
              scale: selectedTimeRange === range.value ? 1.05 : 1,
              opacity: selectedTimeRange === range.value ? 1 : 0.8,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {range.label}
          </motion.span>
        </button>
      ))}
    </div>
  );
}