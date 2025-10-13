// Types
export type {
  PointReason,
  PointTransaction,
  PointsState,
  PointsConfig,
  PointsEvents,
  PointsService,
} from './types';
// Service (for advanced use cases)
export { PointsServiceImpl } from './service';
// React Integration
export { PointsProvider, usePointsContext } from './context';
export { usePoints } from './use-points';
// Components
export { PointsDisplay, LifetimePointsDisplay, PointsAnimation } from './components';

