"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  Mail,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface InvitedUser {
  id: string
  email: string
  status: "pending" | "accepted" | "expired"
  date: string
  role: string
  resendEnabled: boolean
}

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending"
    case "accepted":
      return "Accepted"
    case "expired":
      return "Expired"
    default:
      return "Unknown"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-blue-500 bg-blue-50"
    case "accepted":
      return "text-blue-700 bg-blue-100"
    case "expired":
      return "text-gray-500 bg-gray-100"
    default:
      return "text-gray-500 bg-gray-100"
  }
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [email, setEmail] = React.useState("")
  const [inviteSent, setInviteSent] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [mounted, setMounted] = React.useState(false)
  const itemsPerPage = 5

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  React.useEffect(() => {
    if (email.trim()) setInviteSent(false)
  }, [email])

  const [invitedUsers, setInvitedUsers] = React.useState<InvitedUser[]>([
    {
      id: "1",
      email: "john.doe@example.com",
      status: "pending",
      date: "12/11/2024",
      role: "User",
      resendEnabled: true,
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      status: "accepted",
      date: "12/11/2024",
      role: "Admin",
      resendEnabled: false,
    },
    {
      id: "3",
      email: "robert.johnson@example.com",
      status: "expired",
      date: "12/11/2024",
      role: "User",
      resendEnabled: true,
    },
    {
      id: "4",
      email: "emily.wilson@example.com",
      status: "pending",
      date: "12/11/2024",
      role: "User",
      resendEnabled: true,
    },
    {
      id: "5",
      email: "michael.brown@example.com",
      status: "accepted",
      date: "12/11/2024",
      role: "User",
      resendEnabled: false,
    },
    {
      id: "6",
      email: "sarah.davis@example.com",
      status: "pending",
      date: "12/11/2024",
      role: "Admin",
      resendEnabled: true,
    },
    {
      id: "7",
      email: "david.miller@example.com",
      status: "expired",
      date: "12/11/2024",
      role: "User",
      resendEnabled: true,
    },
    {
      id: "8",
      email: "olivia.jones@example.com",
      status: "pending",
      date: "12/11/2024",
      role: "User",
      resendEnabled: true,
    },
  ])

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const newInvite: InvitedUser = {
      id: Date.now().toString(),
      email: email,
      status: "pending",
      date: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
      role: "User",
      resendEnabled: true,
    }

    setInvitedUsers([newInvite, ...invitedUsers])
    setInviteSent(true)

    setTimeout(() => {
      setInviteSent(false)
      setEmail("")
    }, 2000)
  }

  const filteredUsers = invitedUsers.filter(
    (user) =>
      user.email.toLowerCase().includes("") ||
      user.status.toLowerCase().includes("") ||
      user.role.toLowerCase().includes(""),
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={() => onOpenChange(false)} />
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-6xl h-[calc(100dvh-32px)] sm:h-auto sm:max-h-[85vh] flex flex-col z-[100] border">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Invite Users</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Send invitations to new users and manage existing invites
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                handleSendInvite(e)
              }}
            >
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4 pb-5">
              <div className="relative flex-1 max-w-md">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email-invite"
                  type="email"
                  placeholder="Enter email to invite..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#00A3EC] to-[#6988FF] text-white hover:opacity-90 hover:text-white text-sm"
                disabled={!email.trim()}
              >
                {inviteSent ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Invite Sent</span>
                    <span className="sm:hidden">Sent</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Send Invite</span>
                    <span className="sm:hidden">Send</span>
                  </>
                )}
              </Button>
            </div>
            </form>

            <div className="space-y-6">
            <div className="hidden md:block overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date Sent</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                        >
                          {user.status === "pending" && <Clock className="h-3 w-3 mr-1 text-blue-500" />}
                          {user.status === "accepted" && <CheckCircle2 className="h-3 w-3 mr-1 text-blue-700" />}
                          {user.status === "expired" && <XCircle className="h-3 w-3 mr-1 text-gray-500" />}
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{user.date}</td>
                      <td className="p-3 text-sm">{user.role}</td>
                      <td className="p-3">
                        {user.resendEnabled && (
                          <Button variant="ghost" size="sm" className="text-xs text-blue-500 hover:text-blue-700">
                            Resend
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden grid grid-cols-1 gap-3">
              {currentUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-gradient-to-br from-[#F5F8FF] to-[#EEF4FF] border border-[#D0E0FF] rounded-lg p-4 flex flex-col"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm break-all">{user.email}</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                    >
                      {user.status === "pending" && <Clock className="h-3 w-3 mr-1 text-blue-500" />}
                      {user.status === "accepted" && <CheckCircle2 className="h-3 w-3 mr-1 text-blue-700" />}
                      {user.status === "expired" && <XCircle className="h-3 w-3 mr-1 text-gray-500" />}
                      {getStatusText(user.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Role: </span>
                        <span className="font-medium">{user.role}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{user.date}</div>
                    </div>
                    {user.resendEnabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-500 hover:text-blue-700 h-auto py-1"
                      >
                        Resend
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No invites found</h3>
                <p className="text-muted-foreground mb-4">Send your first invitation to get started.</p>
              </div>
            )}
          </div>
        </div>

        {currentUsers.length > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/50 rounded-b-lg">
            <div className="flex flex-1 items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{" "}
                  <span className="font-medium">{filteredUsers.length}</span> invites
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 flex items-center justify-center rounded-md hidden sm:flex bg-transparent"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 sm:p-0 flex items-center justify-center rounded-md text-xs sm:text-sm bg-transparent"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">Prev</span>
                </Button>
                <span className="text-xs sm:text-sm text-muted-foreground mx-1 sm:mx-2 px-2">
                  <span className="hidden sm:inline">Page </span>
                  {currentPage} <span className="hidden sm:inline">of</span>
                  <span className="inline sm:hidden"> / </span>
                  {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 sm:p-0 flex items-center justify-center rounded-md text-xs sm:text-sm bg-transparent"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1 sm:ml-0" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 flex items-center justify-center rounded-md hidden sm:flex bg-transparent"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default InviteUserDialog
