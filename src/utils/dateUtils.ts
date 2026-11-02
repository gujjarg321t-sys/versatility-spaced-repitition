import { RevisionInterval, RevisionStage } from '../types';

export const REVISION_INTERVALS_CONFIG: {
  interval: RevisionInterval;
  label: string;
  daysOffset: number;
}[] = [
  { interval: '1d', label: '1 Day (24h)', daysOffset: 1 },
  { interval: '3d', label: '3rd Day', daysOffset: 3 },
  { interval: '7d', label: '1 Week (7d)', daysOffset: 7 },
  { interval: '15d', label: '15 Days', daysOffset: 15 },
  { interval: '1m', label: '1 Month (30d)', daysOffset: 30 },
  { interval: '2m', label: '2 Months (60d)', daysOffset: 60 },
];

/**
 * Format date to YYYY-MM-DD
 */
export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parses YYYY-MM-DD safely into local Date object
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Midday to avoid DST shifts
}

/**
 * Add days to YYYY-MM-DD string
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return toISODateString(d);
}

/**
 * Format date with Day of the Week: e.g. "Saturday, 31 Oct 2026"
 */
export function formatDateWithDay(dateStr: string): string {
  try {
    const d = parseDate(dateStr);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${dayName}, ${dayNum} ${monthName} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Returns just Day of Week: e.g. "Saturday"
 */
export function getDayOfWeek(dateStr: string): string {
  try {
    const d = parseDate(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  } catch {
    return '';
  }
}

/**
 * Returns clean short date: e.g. "31 Oct"
 */
export function formatShortDate(dateStr: string): string {
  try {
    const d = parseDate(dateStr);
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return `${dayNum} ${monthName}`;
  } catch {
    return dateStr;
  }
}

/**
 * Check if date is today relative to reference date (defaults to today)
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Check if targetDate is before today (strictly past)
 */
export function isPastDate(targetDate: string, todayDate: string): boolean {
  return targetDate < todayDate;
}

/**
 * Generate 6 spaced repetition stages given an initial task date
 */
export function generateRevisionStages(initialDate: string): RevisionStage[] {
  return REVISION_INTERVALS_CONFIG.map((item) => ({
    interval: item.interval,
    label: item.label,
    daysOffset: item.daysOffset,
    scheduledDate: addDays(initialDate, item.daysOffset),
    completed: false,
  }));
}

/**
 * Unique ID generator without limitations
 */
export function generateUniqueId(prefix = 'tsk'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  const randomPart2 = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}_${randomPart}_${randomPart2}`;
}

/**
 * Calculate difference in days between two YYYY-MM-DD dates
 */
export function daysDifference(targetDate: string, baseDate: string): number {
  const t = parseDate(targetDate).getTime();
  const b = parseDate(baseDate).getTime();
  const diffTime = t - b;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
