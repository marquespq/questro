import React from 'react';
import type { Notification as NotificationType } from '../types';

export type ToastProps = {
  /**
   * Notification data
   */
  notification: NotificationType;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom render function
   */
  children?: (data: {
    notification: NotificationType;
    onDismiss: () => void;
  }) => React.ReactNode;
};

/**
 * Single toast notification
 * 
 * @example
 * ```tsx
 * <Toast notification={notif} onDismiss={() => dismiss(notif.id)} />
 * ```
 */
export function Toast({ notification, onDismiss, className, children }: ToastProps) {
  if (children) {
    return <>{children({ notification, onDismiss })}</>;
  }

  const typeColors: Record<NotificationType['type'], string> = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    levelup: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    achievement: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  };

  return (
    <div
      className={className}
      data-component="toast"
      data-type={notification.type}
      role="alert"
      style={{
        background: typeColors[notification.type],
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {notification.icon && (
        <div data-toast-icon style={{ fontSize: '20px', flexShrink: 0 }}>
          {notification.icon}
        </div>
      )}

      <div data-toast-content style={{ flex: 1 }}>
        <div data-toast-title style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {notification.title}
        </div>
        
        {notification.message && (
          <div data-toast-message style={{ fontSize: '14px', opacity: 0.9 }}>
            {notification.message}
          </div>
        )}

        {notification.action && (
          <button
            onClick={notification.action.onClick}
            data-toast-action
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {notification.dismissible !== false && (
        <button
          onClick={onDismiss}
          data-toast-close
          aria-label="Dismiss"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
