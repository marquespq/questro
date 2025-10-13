import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import type {
  Notification,
  NotificationConfig,
  NotificationInput,
} from './types';
import { NotificationsService } from './NotificationsService';

type NotificationsContextValue = {
  // State
  notifications: Notification[];
  unreadCount: number;

  // Actions
  show: (notification: NotificationInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  markAsRead: (id: string) => void;

  // Convenience methods
  success: (title: string, message?: string, icon?: string) => string;
  error: (title: string, message?: string, icon?: string) => string;
  info: (title: string, message?: string, icon?: string) => string;
  warning: (title: string, message?: string, icon?: string) => string;

  // Gamification shortcuts
  levelUp: (level: number) => string;
  badgeUnlocked: (badgeName: string, badgeIcon?: string) => string;
  questCompleted: (questName: string, points: number) => string;
  streakMilestone: (streak: number) => string;
  streakWarning: (hoursLeft: number) => string;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export type NotificationsProviderProps = {
  children: React.ReactNode;
  config?: NotificationConfig;
};

export function NotificationsProvider({ children, config }: NotificationsProviderProps) {
  const [service] = useState(() => new NotificationsService(config));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to service changes
  useEffect(() => {
    const updateState = () => {
      setNotifications(service.getVisibleNotifications());
      setUnreadCount(service.getUnreadCount());
    };

    updateState(); // Initial state
    const unsubscribe = service.subscribe(updateState);

    return () => {
      unsubscribe();
      service.destroy();
    };
  }, [service]);

  const show = useCallback(
    (notification: NotificationInput) => {
      return service.show(notification);
    },
    [service]
  );

  const dismiss = useCallback(
    (id: string) => {
      service.dismiss(id);
    },
    [service]
  );

  const dismissAll = useCallback(() => {
    service.dismissAll();
  }, [service]);

  const markAsRead = useCallback(
    (id: string) => {
      service.markAsRead(id);
    },
    [service]
  );

  const success = useCallback(
    (title: string, message?: string, icon?: string) => {
      return service.success(title, message, icon);
    },
    [service]
  );

  const error = useCallback(
    (title: string, message?: string, icon?: string) => {
      return service.error(title, message, icon);
    },
    [service]
  );

  const info = useCallback(
    (title: string, message?: string, icon?: string) => {
      return service.info(title, message, icon);
    },
    [service]
  );

  const warning = useCallback(
    (title: string, message?: string, icon?: string) => {
      return service.warning(title, message, icon);
    },
    [service]
  );

  const levelUp = useCallback(
    (level: number) => {
      return service.levelUp(level);
    },
    [service]
  );

  const badgeUnlocked = useCallback(
    (badgeName: string, badgeIcon?: string) => {
      return service.badgeUnlocked(badgeName, badgeIcon);
    },
    [service]
  );

  const questCompleted = useCallback(
    (questName: string, points: number) => {
      return service.questCompleted(questName, points);
    },
    [service]
  );

  const streakMilestone = useCallback(
    (streak: number) => {
      return service.streakMilestone(streak);
    },
    [service]
  );

  const streakWarning = useCallback(
    (hoursLeft: number) => {
      return service.streakWarning(hoursLeft);
    },
    [service]
  );

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      show,
      dismiss,
      dismissAll,
      markAsRead,
      success,
      error,
      info,
      warning,
      levelUp,
      badgeUnlocked,
      questCompleted,
      streakMilestone,
      streakWarning,
    }),
    [
      notifications,
      unreadCount,
      show,
      dismiss,
      dismissAll,
      markAsRead,
      success,
      error,
      info,
      warning,
      levelUp,
      badgeUnlocked,
      questCompleted,
      streakMilestone,
      streakWarning,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = React.useContext(NotificationsContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }

  return context;
}
