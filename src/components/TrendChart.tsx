import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GitHubProject } from '@/types/github';
import { motion } from 'framer-motion';

interface TrendChartProps {
  trendData: GitHubProject['trendData'];
  className?: string;
}

export function TrendChart({ trendData, className = '' }: TrendChartProps) {
  // 只显示最近7个数据点以保持图表简洁
  const displayData = trendData.slice(-7);
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                return value.toString();
              }}
            />
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number') {
                  if (value >= 1000000) return [`${(value / 1000000).toFixed(1)}M`, '星标数'];
                  if (value >= 1000) return [`${(value / 1000).toFixed(1)}k`, '星标数'];
                  return [value.toString(), '星标数'];
                }
                return [value, ''];
              }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="stars"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              fillOpacity={1}
              fill="url(#colorStars)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}