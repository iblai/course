"use client"

import { useState } from "react"
import { SidebarLearner } from "@/components/platform/sidebar-learner"
import { Header } from "@/components/platform/header"
import { PlatformFooter } from "@/components/platform/platform-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { TooltipProvider, TooltipFlowbite } from "@/components/ui/tooltip-flowbite"
import { Search, Check, AlertTriangle, Star, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: number
  username: string
  email: string
  fullName: string
  status: "Active" | "Inactive"
  roles: string[]
  dateJoined: string
  lastLogin: string
}

export default function UsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const isLoggedIn = true

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteMethod, setDeleteMethod] = useState("soft")

  // Form states for Create
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    active: true,
    staff: false,
  })
  const [createFormErrors, setCreateFormErrors] = useState<{
    username?: string
    email?: string
    password?: string
  }>({})

  // Form states for Edit
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    active: false,
    staff: false,
  })

  const users: User[] = [
    {
      id: 1,
      username: "cp_created",
      email: "nunpa+cpcreated@ibleducation.com",
      fullName: "N/A",
      status: "Inactive",
      roles: [],
      dateJoined: "2026-01-21",
      lastLogin: "N/A",
    },
    {
      id: 2,
      username: "test_usuario_api",
      email: "test_api@example.com",
      fullName: "N/A",
      status: "Active",
      roles: [],
      dateJoined: "2026-01-21",
      lastLogin: "N/A",
    },
    {
      id: 3,
      username: "vercel",
      email: "nunpa+vercel@ibleducation.com",
      fullName: "N/A",
      status: "Active",
      roles: ["Staff", "Superuser"],
      dateJoined: "2026-01-15",
      lastLogin: "N/A",
    },
    {
      id: 4,
      username: "lorena",
      email: "nunpa+lorena@ibleducation.com",
      fullName: "N/A",
      status: "Active",
      roles: ["Staff", "Superuser"],
      dateJoined: "2026-01-05",
      lastLogin: "2026-01-25 19:45",
    },
    {
      id: 5,
      username: "am",
      email: "amigot@iblstudios.com",
      fullName: "N/A",
      status: "Active",
      roles: [],
      dateJoined: "2026-01-03",
      lastLogin: "2026-01-03 03:01",
    },
    {
      id: 6,
      username: "test_admin",
      email: "test_admin@ibleducation.com",
      fullName: "N/A",
      status: "Active",
      roles: ["Staff", "Superuser"],
      dateJoined: "2025-07-21",
      lastLogin: "2026-01-20 18:24",
    },
    {
      id: 7,
      username: "cms",
      email: "cms@openedx",
      fullName: "N/A",
      status: "Active",
      roles: [],
      dateJoined: "2025-07-21",
      lastLogin: "N/A",
    },
  ]

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query)
    )
  })

  const handleCreateUser = () => {
    setCreateFormErrors({})
    setIsCreateDialogOpen(true)
  }

  const validateCreateForm = () => {
    const errors: { username?: string; email?: string; password?: string } = {}
    const trimmedUsername = createForm.username.trim()
    const trimmedEmail = createForm.email.trim()
    if (!trimmedUsername) {
      errors.username = "Username is required"
    } else if (trimmedUsername.length < 2) {
      errors.username = "Username must be at least 2 characters"
    }
    if (!trimmedEmail) {
      errors.email = "Email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        errors.email = "Please enter a valid email address"
      }
    }
    if (!createForm.password) {
      errors.password = "Password is required"
    } else if (createForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }
    setCreateFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateSubmit = () => {
    if (!validateCreateForm()) return
    console.log("Create user:", createForm)
    setIsCreateDialogOpen(false)
    setCreateFormErrors({})
    setCreateForm({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      active: true,
      staff: false,
    })
  }

  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      const nameParts = user.fullName !== "N/A" ? user.fullName.split(" ") : ["", ""]
      setEditForm({
        username: user.username,
        email: user.email,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        password: "",
        active: user.status === "Active",
        staff: user.roles.includes("Staff"),
      })
      setIsEditDialogOpen(true)
    }
  }

  const handleEditSubmit = () => {
    console.log("Update user:", selectedUser?.id, editForm)
    setIsEditDialogOpen(false)
    setSelectedUser(null)
  }

  const handleDelete = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setDeleteMethod("soft")
      setIsDeleteDialogOpen(true)
    }
  }

  const handleDeleteSubmit = () => {
    console.log("Delete user:", selectedUser?.id, "Method:", deleteMethod)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="h-screen-dvh overflow-y-auto bg-background">
      {/* Sidebar */}
      <SidebarLearner
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        showAdminButtons={true}
        isLoggedIn={isLoggedIn}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen-dvh transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64",
        )}
      >
        {/* Header */}
        <Header
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          isLoggedIn={isLoggedIn}
          showLogo={true}
          showBackButton={true}
          showModelSelector={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        <div className="flex flex-1">
          <main className="flex-1 transition-all duration-300 pb-[200px] md:pb-[200px]">
            <div className="flex">
              <div className="flex-1 px-5 sm:px-2 py-4 sm:py-8 w-full sm:pl-8 sm:pr-8 md:pr-20">
              {/* Page Header */}
              <div className="mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: "rgb(113,121,133)" }}>
                  Users Management
                </h1>

                {/* Search Bar and Actions - Desktop: one row, Mobile: stacked */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                  <div className="max-w-lg">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="AI Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateUser}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
                  >
                    + Create User
                  </Button>
                </div>
                <div className="mt-2 text-sm" style={{ color: "rgb(113,121,133)" }}>
                  Showing {filteredUsers.length} user(s)
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roles
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Joined
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium" style={{ color: "rgb(113,121,133)" }}>
                              {user.username}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>{user.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>{user.fullName}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium",
                                user.status === "Active"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800",
                              )}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {user.roles.length > 0 ? (
                                user.roles.map((role, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {role}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                              {user.dateJoined}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm" style={{ color: "rgb(113,121,133)" }}>
                              {user.lastLogin}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <TooltipFlowbite content="Edit" position="top">
                                  <button
                                    onClick={() => handleEdit(user.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                                    style={{ backgroundColor: "#F0F4F8" }}
                                  >
                                    <Pencil className="w-4 h-4" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                                  </button>
                                </TooltipFlowbite>
                              </TooltipProvider>
                              <TooltipProvider>
                                <TooltipFlowbite content="Delete" position="top">
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-gray-200 cursor-pointer"
                                    style={{ backgroundColor: "#F5F5F5" }}
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                                  </button>
                                </TooltipFlowbite>
                              </TooltipProvider>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3 mb-[200px]">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1" style={{ color: "rgb(113,121,133)" }}>
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-600">{user.email}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                            user.status === "Active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800",
                          )}
                        >
                          {user.status}
                        </span>
                        {user.roles.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "rgb(113,121,133)" }}>
                        <div>
                          <span className="text-gray-500">Joined:</span> {user.dateJoined}
                        </div>
                        <div>
                          <span className="text-gray-500">Last Login:</span> {user.lastLogin}
                        </div>
                      </div>

                      <div className="flex gap-3.5 pt-2 border-t border-gray-100">
                        <TooltipProvider>
                          <TooltipFlowbite content="Edit" position="top">
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-blue-100 cursor-pointer"
                              style={{ backgroundColor: "#F0F4F8" }}
                            >
                              <Pencil className="w-3.5 h-3.5" style={{ color: "#2563EB" }} strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                        <TooltipProvider>
                          <TooltipFlowbite content="Delete" position="top">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-gray-200 cursor-pointer"
                              style={{ backgroundColor: "#F5F5F5" }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
                            </button>
                          </TooltipFlowbite>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            </div>

            {/* Footer */}
            <PlatformFooter />
          </main>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) setCreateFormErrors({})
        }}
      >
        <DialogContent className="sm:max-w-[420px] gap-3" maxWidth="420px">
          <DialogHeader>
            <DialogTitle className="text-[var(--sidebar-foreground)]">Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-0 pb-3">
            <div className="space-y-2">
              <Label htmlFor="create-username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-username"
                value={createForm.username}
                onChange={(e) => {
                  setCreateForm({ ...createForm, username: e.target.value })
                  if (createFormErrors.username) setCreateFormErrors((prev) => ({ ...prev, username: undefined }))
                }}
                placeholder="Enter username"
                className={cn("w-full", createFormErrors.username && "border-red-500 focus-visible:ring-red-500")}
              />
              {createFormErrors.username && (
                <p className="text-sm text-red-500">{createFormErrors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => {
                  setCreateForm({ ...createForm, email: e.target.value })
                  if (createFormErrors.email) setCreateFormErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder="Enter email"
                className={cn("w-full", createFormErrors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              {createFormErrors.email && (
                <p className="text-sm text-red-500">{createFormErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => {
                  setCreateForm({ ...createForm, password: e.target.value })
                  if (createFormErrors.password) setCreateFormErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="Enter password"
                className={cn("w-full", createFormErrors.password && "border-red-500 focus-visible:ring-red-500")}
              />
              {createFormErrors.password && (
                <p className="text-sm text-red-500">{createFormErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-firstname">First Name</Label>
              <Input
                id="create-firstname"
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                placeholder="Enter first name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-lastname">Last Name</Label>
              <Input
                id="create-lastname"
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                placeholder="Enter last name"
                className="w-full"
              />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-active"
                  checked={createForm.active}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, active: checked === true })}
                />
                <Label htmlFor="create-active" className="font-normal cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-staff"
                  checked={createForm.staff}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, staff: checked === true })}
                />
                <Label htmlFor="create-staff" className="font-normal cursor-pointer">
                  Staff
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[420px] gap-3" maxWidth="420px">
          <DialogHeader>
            <DialogTitle className="text-[var(--sidebar-foreground)]">Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-0 pb-3">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-firstname">First Name</Label>
              <Input
                id="edit-firstname"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastname">Last Name</Label>
              <Input
                id="edit-lastname"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">
                New Password <span className="text-xs text-gray-500 font-normal">(leave empty to keep current)</span>
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Enter new password"
                className="w-full"
              />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={editForm.active}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, active: checked === true })}
                />
                <Label htmlFor="edit-active" className="font-normal cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-staff"
                  checked={editForm.staff}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, staff: checked === true })}
                />
                <Label htmlFor="edit-staff" className="font-normal cursor-pointer">
                  Staff
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px] gap-3" maxWidth="420px">
          <DialogHeader>
            <DialogTitle className="text-[var(--sidebar-foreground)]">Delete User</DialogTitle>
            <p className="text-sm text-gray-600 mt-0.5">
              Select deletion method for user {selectedUser?.username}:
            </p>
          </DialogHeader>
          <div className="pt-0 pb-3">
            <RadioGroup value={deleteMethod} onValueChange={setDeleteMethod} className="space-y-4">
              {/* Soft Delete Option */}
              <div
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  deleteMethod === "soft" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setDeleteMethod("soft")}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="soft" id="soft-delete" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="soft-delete" className="text-base font-semibold cursor-pointer">
                      Soft Delete (Deactivate)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Mark user as inactive. All data preserved. Can be reactivated later.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-sm text-blue-600">
                        <Check className="w-4 h-4 mr-1.5" />
                        Reversible
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Check className="w-4 h-4 mr-1.5" />
                        Preserves data
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Check className="w-4 h-4 mr-1.5" />
                        No foreign key issues
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GDPR Anonymization Option */}
              <div
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  deleteMethod === "gdpr" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => setDeleteMethod("gdpr")}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="gdpr" id="gdpr-delete" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="gdpr-delete" className="text-base font-semibold cursor-pointer flex items-center gap-1">
                      Retire User (GDPR Anonymization)
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Anonymize all personal data (GDPR compliant). Preserves anonymous records for analytics.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <AlertTriangle className="w-4 h-4 mr-1.5" />
                        Irreversible
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Check className="w-4 h-4 mr-1.5" />
                        GDPR compliant
                      </div>
                      <div className="flex items-center text-sm text-blue-600">
                        <Check className="w-4 h-4 mr-1.5" />
                        Preserves analytics
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#00A3EC] to-[#6988FF] hover:opacity-90"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
