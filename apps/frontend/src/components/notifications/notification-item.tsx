import type { Notification } from '@facteurjs/client/types'

import { BellRing, Check, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (notificationId: string) => void
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const formatNotificationContent = (notification: Notification) => {
    if (typeof notification.content === 'string') {
      return notification.content
    }

    if (notification.content.title && notification.content.body) {
      return {
        title: notification.content.title,
        body: notification.content.body,
        chatId: notification.content?.chatId,
      }
    }

    return {
      title: notification.type.replace(/_/g, ' '),
      body: JSON.stringify(notification.content),
    }
  }

  const getNotificationIcon = (notification: Notification) => {
    if (notification.status === 'read') return <Check className="w-4 h-4 text-green-500" />
    if (notification.status === 'seen') return <Eye className="w-4 h-4 text-blue-500" />
    return <BellRing className="w-4 h-4 text-orange-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read':
        return 'bg-purple-50 border-purple-200'
      case 'seen':
        return 'bg-blue-50 border-blue-200'
      case 'unread':
      case 'unseen':
      default:
        return 'bg-orange-50 border-orange-200'
    }
  }

  const content = formatNotificationContent(notification)

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors border rounded-md ${getStatusColor(notification.status)}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">{getNotificationIcon(notification)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {typeof content === 'object' && content.title ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{content.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{content.body}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-900">
                  {typeof content === 'string' ? content : JSON.stringify(content)}
                </p>
              )}
            </div>

            <div className="flex gap-1 ml-2">
              {notification.status !== 'read' && notification.status !== 'seen' && (
                <Button
                  variant="outline"
                  onClick={() => onMarkAsRead(notification.id as string)}
                  title="Mark as read"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {notification.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <time className="text-xs text-gray-500">
              {new Date(notification.createdAt!).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          </div>
        </div>
      </div>
    </div>
  )
}
