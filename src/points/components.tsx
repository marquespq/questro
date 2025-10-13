import type { ReactNode, HTMLAttributes } from 'react';
import { usePoints } from './use-points';
interface PointsDisplayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  format?: (balance: number) => string;
}
export function PointsDisplay({ children, format, ...props }: PointsDisplayProps) {
  const { balance } = usePoints();
  const displayValue = format ? format(balance) : balance.toLocaleString();
  return (
    <div data-questro-points {...props}>
      {children ?? displayValue}
    </div>
  );
}
interface LifetimePointsDisplayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  format?: (lifetime: number) => string;
}
export function LifetimePointsDisplay({ children, format, ...props }: LifetimePointsDisplayProps) {
  const { lifetime } = usePoints();
  const displayValue = format ? format(lifetime) : lifetime.toLocaleString();
  return (
    <div data-questro-lifetime-points {...props}>
      {children ?? displayValue}
    </div>
  );
}
interface PointsAnimationProps {
  children: (balance: number, isIncreasing: boolean) => ReactNode;
}
export function PointsAnimation({ children }: PointsAnimationProps) {
  const { balance } = usePoints();
  const [previousBalance, setPreviousBalance] = React.useState(balance);
  const [isIncreasing, setIsIncreasing] = React.useState(false);
  React.useEffect(() => {
    if (balance !== previousBalance) {
      setIsIncreasing(balance > previousBalance);
      setPreviousBalance(balance);
    }
  }, [balance, previousBalance]);
  return <>{children(balance, isIncreasing)}</>;
}
// Re-export React for the component above
import * as React from 'react';

