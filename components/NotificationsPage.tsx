
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import PageWrapper from './common/PageWrapper';
import { NotificationItem as NotificationType } from '../types';
import Button from './common/Button';
import BellIcon from './icons/BellIcon';

const NotificationItem: React.FC<{ notification: NotificationType, onMarkAsRead: (id: string) => void }> = ({ notification, onMarkAsRead }) => {
  let bgColor = 'bg-slate-800';
  let textColor = 'text-slate-100';
  let borderColor = 'border-slate-700';

  switch (notification.type) {
    case 'success':
      bgColor = 'bg-green-500/20'; textColor = 'text-green-300'; borderColor = 'border-green-500/50';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500/20'; textColor = 'text-yellow-300'; borderColor = 'border-yellow-500/50';
      break;
    case 'error':
      bgColor = 'bg-red-500/20'; textColor = 'text-red-300'; borderColor = 'border-red-500/50';
      break;
    case 'offer':
       bgColor = 'bg-blue-500/20'; textColor = 'text-blue-300'; borderColor = 'border-blue-500/50';
       break;
    case 'info':
    default:
       bgColor = 'bg-slate-700'; textColor = 'text-slate-200'; borderColor = 'border-slate-600';
      break;
  }

  return (
    <div className={`p-4 rounded-lg shadow-md border-l-4 ${borderColor} ${bgColor} ${notification.read ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`font-medium ${textColor}`}>{notification.message}</p>
          <p className="text-xs text-slate-400 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
        </div>
        {!notification.read && (
          <Button 
            onClick={() => onMarkAsRead(notification.id)} 
            variant="ghost" 
            className="text-xs px-2 py-1 ml-2 border-slate-500 text-slate-400 hover:bg-slate-600"
            aria-label="Mark as read"
          >
            ✓
          </Button>
        )}
      </div>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useAppContext();

  return (
    <PageWrapper title="Notifications">
      {notifications.length > 0 && (
        <div className="mb-4 text-right">
          <Button onClick={clearNotifications} variant="danger" className="text-xs px-3 py-1.5">
            Clear All
          </Button>
        </div>
      )}
      {notifications.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BellIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No new notifications.</p>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <NotificationItem key={notif.id} notification={notif} onMarkAsRead={markNotificationAsRead} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default NotificationsPage;
    