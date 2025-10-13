import type { ReactNode, HTMLAttributes } from 'react';
import type { EntityId } from '@questro/core';
import type { Badge, BadgeProgress } from './types';
import { useBadges } from './use-badges';
interface BadgeCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  badge: Badge;
  children?: (badge: Badge, isUnlocked: boolean, progress?: BadgeProgress) => ReactNode;
}
export function BadgeCard({ badge, children, ...props }: BadgeCardProps) {
  const { isBadgeUnlocked, getProgress } = useBadges();
  const isUnlocked = isBadgeUnlocked(badge.id);
  const progress = getProgress(badge.id);
  if (children) {
    return <>{children(badge, isUnlocked, progress)}</>;
  }
  return (
    <div data-questro-badge data-unlocked={isUnlocked} {...props}>
      {badge.icon && <span data-questro-badge-icon>{badge.icon}</span>}
      <div data-questro-badge-content>
        <h3 data-questro-badge-name>{badge.name}</h3>
        <p data-questro-badge-description>{badge.description}</p>
        {progress && !isUnlocked && (
          <div data-questro-badge-progress>Progress: {progress.percentage.toFixed(0)}%</div>
        )}
      </div>
    </div>
  );
}
interface BadgeGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  badges?: readonly Badge[];
  showLocked?: boolean;
  showHidden?: boolean;
  children?: (badge: Badge) => ReactNode;
}
export function BadgeGrid({
  badges: providedBadges,
  showLocked = true,
  showHidden = false,
  children,
  ...props
}: BadgeGridProps) {
  const { allBadges, isBadgeUnlocked } = useBadges();
  const badgesToDisplay = providedBadges ?? allBadges;
  const filteredBadges = badgesToDisplay.filter((badge) => {
    const isUnlocked = isBadgeUnlocked(badge.id);
    // Filter locked badges if showLocked is false
    if (!showLocked && !isUnlocked) {
      return false;
    }
    // Filter hidden badges if showHidden is false
    if (!showHidden && badge.hidden && !isUnlocked) {
      return false;
    }
    return true;
  });
  return (
    <div data-questro-badge-grid {...props}>
      {filteredBadges.map((badge) =>
        children ? children(badge) : <BadgeCard key={badge.id} badge={badge} />
      )}
    </div>
  );
}
interface BadgeProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  badgeId: EntityId;
  showLabel?: boolean;
}
export function BadgeProgressBar({ badgeId, showLabel = true, ...props }: BadgeProgressBarProps) {
  const { getProgress } = useBadges();
  const progress = getProgress(badgeId);
  if (!progress) {
    return null;
  }
  return (
    <div data-questro-badge-progress-bar {...props}>
      {showLabel && (
        <div data-questro-badge-progress-label>
          {progress.current} / {progress.target}
        </div>
      )}
      <div
        data-questro-badge-progress-track
        style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0' }}
      >
        <div
          data-questro-badge-progress-fill
          style={{
            width: `${progress.percentage}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {showLabel && (
        <div data-questro-badge-progress-percentage>{progress.percentage.toFixed(0)}%</div>
      )}
    </div>
  );
}
interface BadgeCountProps extends HTMLAttributes<HTMLSpanElement> {
  type?: 'unlocked' | 'total' | 'locked';
}
export function BadgeCount({ type = 'unlocked', ...props }: BadgeCountProps) {
  const { allBadges, unlockedBadges, lockedBadges } = useBadges();
  let count: number;
  switch (type) {
    case 'unlocked':
      count = unlockedBadges.length;
      break;
    case 'locked':
      count = lockedBadges.length;
      break;
    case 'total':
      count = allBadges.length;
      break;
  }
  return (
    <span data-questro-badge-count data-type={type} {...props}>
      {count}
    </span>
  );
}

