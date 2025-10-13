/**
 * Notification type/severity
 */
export type NotificationType =
  | 'success'      // Green - Achievement unlocked, quest completed
  | 'info'         // Blue - General information
  | 'warning'      // Yellow - Streak at risk
  | 'error'        // Red - Error occurred
  | 'levelup'      // Gold/Orange - Level up
  | 'achievement'; // Purple - Special achievement

/**
 * Notification position on screen
 */
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Single notification
 */
export type Notification = {
  /**
   * Unique ID
   */
  id: string;

  /**
   * Notification type
   */
  type: NotificationType;

  /**
   * Main title
   */
  title: string;

  /**
   * Optional message
   */
  message?: string;

  /**
   * Icon (emoji or React node)
   */
  icon?: string;

  /**
   * Duration in ms (0 = infinite)
   * @default 5000
   */
  duration?: number;

  /**
   * Can be dismissed by user
   * @default true
   */
  dismissible?: boolean;

  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Timestamp when created
   */
  timestamp: number;

  /**
   * Whether notification was read
   */
  read?: boolean;
};

/**
 * Notification configuration
 */
export type NotificationConfig = {
  /**
   * Default position
   * @default 'top-right'
   */
  position?: NotificationPosition;

  /**
   * Max notifications shown simultaneously
   * @default 5
   */
  maxNotifications?: number;

  /**
   * Default duration in ms
   * @default 5000
   */
  defaultDuration?: number;

  /**
   * Enable animations
   * @default true
   */
  animations?: boolean;

  /**
   * Play sound on notification
   * @default false
   */
  sound?: boolean;

  /**
   * Sound file URL
   */
  soundUrl?: string;
};

/**
 * Notification input (before ID/timestamp added)
 */
export type NotificationInput = Omit<Notification, 'id' | 'timestamp'>;

/**
 * Persisted notifications state
 */
export type NotificationsState = {
  /**
   * All notifications (including dismissed)
   */
  notifications: Notification[];

  /**
   * Last update timestamp
   */
  lastUpdated: number;
};
