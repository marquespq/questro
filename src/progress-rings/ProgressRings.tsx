import { useEffect, useState } from 'react';
import type { ProgressRingsProps, ProgressRingProps } from './types';

export function ProgressRings({
  rings,
  size = 200,
  strokeWidth = 20,
  gap = 8,
  showCenter = true,
  centerText,
  centerLabel,
  animated = true,
  animationDuration = 1000,
  style,
  className,
}: ProgressRingsProps) {
  const firstRing = rings[0];
  const defaultCenterText = firstRing
    ? `${Math.round((firstRing.value / firstRing.max) * 100)}%`
    : '0%';

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        ...style,
      }}
    >
      {/* Rings */}
      {rings.map((ring, index) => {
        const ringSize = size - index * (strokeWidth + gap) * 2;
        const ringStrokeWidth = strokeWidth;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ProgressRing
              value={ring.value}
              max={ring.max}
              size={ringSize}
              strokeWidth={ringStrokeWidth}
              color={ring.color}
              gradientColor={ring.gradientColor}
              animated={animated}
              animationDuration={animationDuration}
            />
          </div>
        );
      })}

      {/* Center Content */}
      {showCenter && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: size * 0.15,
              fontWeight: 'bold',
              color: '#1e293b',
              lineHeight: 1,
            }}
          >
            {centerText ?? defaultCenterText}
          </div>
          {centerLabel && (
            <div
              style={{
                fontSize: size * 0.06,
                color: '#64748b',
                marginTop: size * 0.02,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProgressRing({
  value,
  max,
  size,
  strokeWidth,
  color,
  gradientColor,
  animated = true,
  animationDuration = 1000,
  className,
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) {
      setAnimatedValue(value);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    const targetValue = value;
    const duration = animationDuration;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      const currentValue = startValue + (targetValue - startValue) * easeProgress;
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, animated, animationDuration]);

  const percentage = Math.min((animatedValue / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{
        transform: 'rotate(-90deg)',
      }}
    >
      <defs>
        {gradientColor && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={gradientColor} />
          </linearGradient>
        )}
      </defs>

      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />

      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={gradientColor ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: animated ? 'stroke-dashoffset 0.3s ease' : undefined,
        }}
      />
    </svg>
  );
}

interface ProgressRingsWithLabelsProps extends ProgressRingsProps {
  /**
   * Show ring labels
   * @default true
   */
  showLabels?: boolean;
}

export function ProgressRingsWithLabels({
  rings,
  showLabels = true,
  ...props
}: ProgressRingsWithLabelsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Rings */}
      <ProgressRings rings={rings} {...props} />

      {/* Labels */}
      {showLabels && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {rings.map((ring, index) => {
            const percentage = Math.round((ring.value / ring.max) * 100);
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: ring.gradientColor
                      ? `linear-gradient(135deg, ${ring.color}, ${ring.gradientColor})`
                      : ring.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {ring.label}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {ring.value}/{ring.max}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: ring.color,
                    minWidth: '40px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
