"use client";

import { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "New Customer Sign Up",
    message: "Enterprise customer 'Tech Solutions Inc.' has completed registration",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Follow-up Required",
    message: "Customer 'Digital Dynamics' needs response to their inquiry",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "Task Completed",
    message: "Weekly analytics report has been generated",
    time: "2 hours ago",
    read: true,
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(notifications);

  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  const getIconByType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAllAsRead = () => {
    setActiveNotifications(
      activeNotifications.map((n) => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setActiveNotifications(activeNotifications.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="relative h-9"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4 mr-2" />
        <span className="text-sm">Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg border shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {activeNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              <div className="divide-y">
                {activeNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getIconByType(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-b-lg border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
