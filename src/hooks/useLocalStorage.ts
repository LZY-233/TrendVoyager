import { useState, useEffect } from 'react';

// 自定义Hook：使用localStorage存储数据
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 从localStorage获取初始值或使用默认值
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  // 当值变化时更新localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}