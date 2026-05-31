import { createFileRoute } from '@tanstack/react-router'

import NotificationCenter from '@/components/notifications/notification-center'

export const Route = createFileRoute('/$locale/(dashboard)/notifications/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Gérez vos notifications.</p>
      </div>
      <NotificationCenter />
    </div>
  )
}
