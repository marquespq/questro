import type {
  Notification,
  NotificationConfig,
  NotificationInput,
  NotificationsState,
} from './types';

export class NotificationsService {
  private state: NotificationsState;
  private config: Required<Omit<NotificationConfig, 'soundUrl'>> & {
    soundUrl?: string;
  };
  private listeners: Set<() => void> = new Set();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: NotificationConfig = {}, initialState?: NotificationsState) {
    this.config = {
      position: config.position || 'top-right',
      maxNotifications: config.maxNotifications ?? 5,
      defaultDuration: config.defaultDuration ?? 5000,
      animations: config.animations ?? true,
      sound: config.sound ?? false,
      soundUrl: config.soundUrl,
    };

    this.state = initialState || this.createInitialState();
  }

  private createInitialState(): NotificationsState {
    return {
      notifications: [],
      lastUpdated: Date.now(),
    };
  }

  /**
   * Show a notification
   */
  show(input: NotificationInput): string {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      ...input,
      id,
      timestamp: Date.now(),
      duration: input.duration ?? this.config.defaultDuration,
      dismissible: input.dismissible ?? true,
      read: false,
    };

    // Add to state (keep only max notifications visible)
    this.state.notifications = [
      notification,
      ...this.state.notifications.slice(0, this.config.maxNotifications - 1),
    ];

    this.state.lastUpdated = Date.now();

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      const timeout = setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);
      
      this.timeouts.set(id, timeout);
    }

    // Play sound
    if (this.config.sound) {
      this.playSound();
    }

    this.notifyListeners();
    return id;
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): void {
    this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    this.state.lastUpdated = Date.now();

    // Clear timeout
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }

    this.notifyListeners();
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.state.notifications = [];
    this.state.lastUpdated = Date.now();

    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();

    this.notifyListeners();
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.state.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.state.lastUpdated = Date.now();
      this.notifyListeners();
    }
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.state.notifications];
  }

  /**
   * Get visible notifications
   */
  getVisibleNotifications(): Notification[] {
    return this.state.notifications.slice(0, this.config.maxNotifications);
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.state.notifications.filter(n => !n.read).length;
  }

  /**
   * Get state for persistence
   */
  getState(): NotificationsState {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Cleanup (clear all timeouts)
   */
  destroy(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    this.listeners.clear();
  }

  private playSound(): void {
    if (this.config.soundUrl) {
      try {
        const audio = new Audio(this.config.soundUrl);
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Ignore errors (user might not have interacted with page yet)
        });
      } catch {
        // Ignore audio errors
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Convenience methods for common notification types
  
  success(title: string, message?: string, icon: string = '✅'): string {
    return this.show({ type: 'success', title, message, icon });
  }

  error(title: string, message?: string, icon: string = '❌'): string {
    return this.show({ type: 'error', title, message, icon });
  }

  info(title: string, message?: string, icon: string = 'ℹ️'): string {
    return this.show({ type: 'info', title, message, icon });
  }

  warning(title: string, message?: string, icon: string = '⚠️'): string {
    return this.show({ type: 'warning', title, message, icon });
  }

  // Gamification-specific notifications

  levelUp(level: number): string {
    return this.show({
      type: 'levelup',
      title: `Level ${level}!`,
      message: `You've reached level ${level}`,
      icon: '⬆️',
      duration: 7000,
    });
  }

  badgeUnlocked(badgeName: string, badgeIcon?: string): string {
    return this.show({
      type: 'achievement',
      title: 'Badge Unlocked!',
      message: badgeName,
      icon: badgeIcon || '🏆',
      duration: 7000,
    });
  }

  questCompleted(questName: string, points: number): string {
    return this.show({
      type: 'success',
      title: 'Quest Completed!',
      message: `${questName} (+${points} points)`,
      icon: '🎯',
      duration: 6000,
    });
  }

  streakMilestone(streak: number): string {
    return this.show({
      type: 'achievement',
      title: `${streak} Day Streak! 🔥`,
      message: `You've maintained your streak for ${streak} days!`,
      icon: '🎉',
      duration: 7000,
    });
  }

  streakWarning(hoursLeft: number): string {
    return this.show({
      type: 'warning',
      title: 'Streak at Risk!',
      message: `Complete an activity in ${Math.round(hoursLeft)} hours to keep your streak`,
      icon: '⚠️',
      duration: 10000,
    });
  }
}
