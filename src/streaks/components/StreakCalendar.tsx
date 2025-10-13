import React from 'react';
import { useStreaks } from '../StreaksProvider';
import type { CalendarDay } from '../types';

export type StreakCalendarProps = {
  /**
   * Month (0-11)
   * @default current month
   */
  month?: number;

  /**
   * Year
   * @default current year
   */
  year?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom render for each day
   */
  renderDay?: (day: CalendarDay) => React.ReactNode;

  /**
   * Custom render function for entire calendar
   */
  children?: (data: {
    days: CalendarDay[];
    month: number;
    year: number;
  }) => React.ReactNode;
};

/**
 * Calendar showing streak activity history
 * 
 * @example
 * ```tsx
 * <StreakCalendar month={9} year={2024} />
 * ```
 * 
 * @example Custom day rendering
 * ```tsx
 * <StreakCalendar
 *   renderDay={(day) => (
 *     <div className={day.completed ? 'bg-green-500' : 'bg-gray-200'}>
 *       {new Date(day.date).getDate()}
 *     </div>
 *   )}
 * />
 * ```
 */
export function StreakCalendar({
  month,
  year,
  className,
  renderDay,
  children,
}: StreakCalendarProps) {
  const { getCalendarData } = useStreaks();

  const now = new Date();
  const currentMonth = month ?? now.getMonth();
  const currentYear = year ?? now.getFullYear();

  const days = getCalendarData(currentMonth, currentYear);

  if (children) {
    return (
      <>
        {children({
          days,
          month: currentMonth,
          year: currentYear,
        })}
      </>
    );
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'long',
  });

  return (
    <div className={className} data-component="streak-calendar">
      <div data-calendar-header>
        <h3>
          {monthName} {currentYear}
        </h3>
      </div>

      <div
        data-calendar-grid
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {/* Week day headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div
            key={i}
            data-calendar-weekday
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '4px',
            }}
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day) => {
          if (renderDay) {
            return <React.Fragment key={day.date}>{renderDay(day)}</React.Fragment>;
          }

          return (
            <div
              key={day.date}
              data-calendar-day
              data-completed={day.completed}
              data-is-today={day.isToday}
              data-is-future={day.isFuture}
              data-freeze-used={day.freezeUsed}
              style={{
                padding: '8px',
                textAlign: 'center',
                borderRadius: '4px',
                backgroundColor: day.completed
                  ? '#4ade80'
                  : day.freezeUsed
                    ? '#60a5fa'
                    : day.isFuture
                      ? '#f3f4f6'
                      : '#fca5a5',
                color: day.completed || day.freezeUsed ? 'white' : 'black',
                opacity: day.isFuture ? 0.5 : 1,
              }}
            >
              {new Date(day.date).getDate()}
              {day.completed && ' ✓'}
              {day.freezeUsed && ' ❄️'}
            </div>
          );
        })}
      </div>

      <div data-calendar-legend style={{ marginTop: '12px', fontSize: '12px' }}>
        <div>🟢 Completed | 🔵 Freeze Used | 🔴 Missed | ⚪ Future</div>
      </div>
    </div>
  );
}
