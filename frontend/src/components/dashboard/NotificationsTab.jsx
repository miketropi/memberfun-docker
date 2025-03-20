import React from 'react';

const NotificationsTab = ({ notifications = [], markAsRead, markAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              markAsRead={markAsRead} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-500">No notifications to display.</p>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({ notification, markAsRead }) => {
  const formattedDate = new Date(notification.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div 
      className={`p-4 rounded-lg border ${
        notification.read 
          ? 'bg-white border-gray-200' 
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex justify-between">
        <div>
          <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
        </div>
        {!notification.read && (
          <button 
            onClick={() => markAsRead(notification.id)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab; 