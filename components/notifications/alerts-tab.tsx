"use client"

import { Bell, Pencil } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { NotificationTemplate } from "@/types/notification"

interface AlertsTabProps {
  templates: NotificationTemplate[]
  notificationsEnabled: boolean
  onToggleNotifications: (enabled: boolean) => void
  onToggleTemplate: (id: string) => void
  onEditTemplate: (template: NotificationTemplate) => void
}

export function AlertsTab({
  templates,
  notificationsEnabled,
  onToggleNotifications,
  onToggleTemplate,
  onEditTemplate,
}: AlertsTabProps) {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full px-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-600">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
        </div>
        <Switch checked={notificationsEnabled} onCheckedChange={onToggleNotifications} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-600">Notification Templates</h3>
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-600">{template.name}</h4>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: template.active ? "var(--accent-color)" : "#f1f5f9",
                      color: template.active ? "var(--primary-color)" : "#64748b"
                    }}
                  >
                    {template.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{template.preview}</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={template.active} onCheckedChange={() => onToggleTemplate(template.id)} />
                <Button variant="ghost" size="icon" onClick={() => onEditTemplate(template)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
