import React from 'react';
import { useNotifications } from '../NotificationsProvider';
import { Toast } from './Toast';
import type { Notification } from '../types';

export type ToastPosition = 
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NotificationContainerProps = {
  /**
   * Position of the notification container
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Maximum visible notifications at once
   * @default 3
   */
  maxVisible?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom render function for each toast
   */
  renderToast?: (
    notification: Notification,
    onDismiss: () => void
  ) => React.ReactNode;

  /**
   * Custom render function for container
   */
  children?: (data: {
    notifications: Notification[];
    dismiss: (id: string) => void;
    position: ToastPosition;
  }) => React.ReactNode;
};

/**
 * Container for displaying toast notifications
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <NotificationContainer />
 * 
 * // Custom position
 * <NotificationContainer position="bottom-center" />
 * 
 * // Limit visible toasts
 * <NotificationContainer maxVisible={5} />
 * 
 * // Custom render
 * <NotificationContainer
 *   renderToast={(notif, dismiss) => (
 *     <MyCustomToast {...notif} onClose={() => dismiss(notif.id)} />
 *   )}
 * />
 * ```
 */
export function NotificationContainer({
  position = 'top-right',
  maxVisible = 3,
  className,
  renderToast,
  children,
}: NotificationContainerProps) {
  const { notifications, dismiss } = useNotifications();

  const visibleNotifications = notifications.slice(0, maxVisible);

  if (children) {
    return <>{children({ notifications: visibleNotifications, dismiss, position })}</>;
  }

  const positionStyles: Record<ToastPosition, React.CSSProperties> = {
    'top-left': { top: 20, left: 20, alignItems: 'flex-start' },
    'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
    'top-right': { top: 20, right: 20, alignItems: 'flex-end' },
    'bottom-left': { bottom: 20, left: 20, alignItems: 'flex-start' },
    'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
    'bottom-right': { bottom: 20, right: 20, alignItems: 'flex-end' },
  };

  return (
    <div
      className={className}
      data-component="notification-container"
      data-position={position}
      style={{
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
        ...positionStyles[position],
      }}
    >
      {visibleNotifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          {renderToast ? (
            renderToast(notification, () => dismiss(notification.id))
          ) : (
            <Toast
              notification={notification}
              onDismiss={() => dismiss(notification.id)}
            />
          )}
        </div>
      ))}

      {notifications.length > maxVisible && (
        <div
          data-notification-overflow
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          +{notifications.length - maxVisible} more
        </div>
      )}
    </div>
  );
}
