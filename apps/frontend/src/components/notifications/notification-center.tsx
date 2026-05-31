import type { Notification } from '@facteurjs/client/types'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { useMarkAllAsRead, useMarkAsRead, useNotifications } from '@facteurjs/react'

import NotificationItem from './notification-item'
import Loader from '../common/loader'

const NOTIFICATIONS_PER_PAGE = 10

export default function NotificationCenter() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('unread')
  const [currentPage, setCurrentPage] = useState(1)

  const markAsReadMutation = useMarkAsRead()
  const { data: notifications = [], isLoading } = useNotifications({
    page: currentPage,
    limit: NOTIFICATIONS_PER_PAGE,
    status: filter === 'all' ? undefined : filter,
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const markAllAsReadMutation = useMarkAllAsRead()

  const hasNextPage = notifications.length === NOTIFICATIONS_PER_PAGE
  const hasPreviousPage = currentPage > 1

  if (isLoading) {
    return <Loader text="Chargement des notifications..." />
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as 'all' | 'unread' | 'read')}
          >
            <TabsList>
              <TabsTrigger value="unread">Non lues</TabsTrigger>
              <TabsTrigger value="read">Lues</TabsTrigger>
              <TabsTrigger value="all">Toutes</TabsTrigger>
            </TabsList>
          </Tabs>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate({})}
              disabled={markAllAsReadMutation.isPending}
            >
              Marquer tout comme lu
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Aucune notification trouvée</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {notifications.map((notification: Notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={(notificationId) =>
                      markAsReadMutation.mutate({
                        notificationId,
                      })
                    }
                  />
                ))}
              </div>

              {(hasNextPage || hasPreviousPage) && (
                <div className="flex items-center justify-center pt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => hasPreviousPage && setCurrentPage(currentPage - 1)}
                          className={
                            !hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {currentPage > 2 && (
                        <>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setCurrentPage(1)}
                              className="cursor-pointer"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {currentPage > 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )}

                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="cursor-pointer"
                          >
                            {currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationLink isActive className="cursor-pointer">
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>

                      {hasNextPage && (
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="cursor-pointer"
                          >
                            {currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => hasNextPage && setCurrentPage(currentPage + 1)}
                          className={
                            !hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
