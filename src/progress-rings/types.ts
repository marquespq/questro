import type { CSSProperties } from 'react';

/**
 * Single ring data
 */
export interface RingData {
  /**
   * Ring label
   */
  label: string;
  /**
   * Current value
   */
  value: number;
  /**
   * Maximum value
   */
  max: number;
  /**
   * Ring color (hex or gradient)
   */
  color: string;
  /**
   * Optional secondary color for gradient
   */
  gradientColor?: string;
}

/**
 * Progress rings props
 */
export interface ProgressRingsProps {
  /**
   * Array of rings (outer to inner)
   */
  rings: RingData[];
  /**
   * Size of the component
   * @default 200
   */
  size?: number;
  /**
   * Ring thickness
   * @default 20
   */
  strokeWidth?: number;
  /**
   * Gap between rings
   * @default 8
   */
  gap?: number;
  /**
   * Show center text
   * @default true
   */
  showCenter?: boolean;
  /**
   * Center text (default: percentage of first ring)
   */
  centerText?: string;
  /**
   * Center label
   */
  centerLabel?: string;
  /**
   * Enable animation
   * @default true
   */
  animated?: boolean;
  /**
   * Animation duration in ms
   * @default 1000
   */
  animationDuration?: number;
  style?: CSSProperties;
  className?: string;
}

/**
 * Single progress ring props
 */
export interface ProgressRingProps {
  value: number;
  max: number;
  size: number;
  strokeWidth: number;
  color: string;
  gradientColor?: string;
  animated?: boolean;
  animationDuration?: number;
  className?: string;
}
