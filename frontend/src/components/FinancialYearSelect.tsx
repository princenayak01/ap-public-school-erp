import React from 'react';
import { Calendar } from 'lucide-react';

interface FinancialYearSelectProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const ACADEMIC_MONTHS = [
  'All Months (Apr - Mar)',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
];

export const FinancialYearSelect: React.FC<FinancialYearSelectProps> = ({
  selectedYear,
  onYearChange,
  selectedMonth = 'All Months (Apr - Mar)',
  onMonthChange,
}) => {
  const years = [2026, 2025, 2024];

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center space-x-1.5 text-slate-500">
        <Calendar className="w-3.5 h-3.5 text-teal-600" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Session:</span>
      </div>

      {/* Year (April to March Financial/Academic Year) */}
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            April {y} – March {y + 1}
          </option>
        ))}
      </select>

      {/* Month Filter */}
      {onMonthChange && (
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
        >
          {ACADEMIC_MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FinancialYearSelect;
