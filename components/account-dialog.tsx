"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { User, Briefcase, Globe, Shield, Search } from "lucide-react"
import Image from "next/image"

interface AccountInfo {
  fullName: string
  email: string
  username: string
  title: string
  about: string
  language: string
  mentorAI: boolean
  skillsLeaderboard: boolean
  publicProfile?: boolean
  facebook: string
  linkedin: string
  twitter: string
}

interface UserData {
  id: string
  name: string
  email: string
  role: "Admin" | "Student"
}

interface CurrentUserData {
  displayName: string
  email: string
  photoURL: string
}

interface AccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (info: AccountInfo) => void
  initialInfo?: AccountInfo
  currentUserData?: CurrentUserData
}

export function AccountDialog({ open, onOpenChange, onSave, initialInfo, currentUserData }: AccountDialogProps) {
  const [activeTab, setActiveTab] = useState("basic")

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    fullName: currentUserData?.displayName || "John Doe",
    email: currentUserData?.email || "zz7676001@gmail.com",
    username: "LarryZipBJZcnVn",
    title: "finance controller | network engineer | manager",
    about: "........... testing",
    language: "English",
    mentorAI: false,
    skillsLeaderboard: false,
    facebook: "",
    linkedin: "",
    twitter: "",
  })

  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "sonitwo", email: "sonitwo@ibleducation.com", role: "Admin" },
    { id: "2", name: "Ibl", email: "iblai@ibleducation.com", role: "Admin" },
    { id: "3", name: "Brian Ngabidong", email: "brian@ibleducation.com", role: "Student" },
    { id: "4", name: "Ibl Ai", email: "iblai2@ibleducation.com", role: "Student" },
    { id: "5", name: "Brian", email: "brian+256@ibleducation.com", role: "Student" },
    { id: "6", name: "Mikel Amigot", email: "amigotmikel@gmail.com", role: "Admin" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const [selectedImage, setSelectedImage] = useState<string | null>(currentUserData?.photoURL || "/images/user-avatar.webp")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentUserData) {
      setAccountInfo((prev) => ({
        ...prev,
        fullName: currentUserData.displayName,
        email: currentUserData.email,
      }))
      setSelectedImage(currentUserData.photoURL)
    }
  }, [currentUserData])

  useEffect(() => {
    if (open && initialInfo) {
      setAccountInfo(initialInfo)
    }
  }, [open, initialInfo])

  const handleInputChange = (field: keyof AccountInfo, value: any) => {
    setAccountInfo({
      ...accountInfo,
      [field]: value,
    })
  }

  const handleSave = () => {
    onSave(accountInfo)
    onOpenChange(false)
  }

  const handlePasswordReset = () => {
    alert("Password reset link sent to your email")
  }

  const handleRoleChange = (userId: string, newRole: "Admin" | "Student") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
      <DialogContent
        className="max-w-6xl w-[95vw] sm:w-[90vw] p-0 gap-0 overflow-hidden z-[9999] [&>button]:hidden"
        style={{ height: "85vh", maxHeight: "85vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          <div className="lg:hidden">
            <DialogHeader className="px-6 py-4 border-b border-gray-200">
              <DialogTitle className="text-lg font-semibold text-gray-900">Profile</DialogTitle>
            </DialogHeader>
          </div>

          <div
            className="hidden lg:flex bg-white border-r border-gray-200 dark:border-gray-700 flex-col overflow-hidden"
            style={{
              width: "320px",
              height: "100%",
            }}
          >
            <div className="flex flex-col items-center justify-center py-8 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="relative w-20 h-20 mb-6 cursor-pointer group" onClick={handleAvatarClick}>
                {selectedImage ? (
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover w-full h-full group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full overflow-hidden group-hover:opacity-80 transition-opacity bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-600">
                      {accountInfo.fullName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-4">
                {accountInfo.fullName}
              </h2>

              <div className="flex justify-center space-x-3">
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-xs font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  ADMIN
                </div>
                <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-xs font-medium">0010500000...</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
              <div className="p-4">
                <div className="flex flex-col space-y-2">
                  {[
                    { id: "basic", label: "Basic", icon: User },
                    { id: "social", label: "Social", icon: Globe },
                    { id: "security", label: "Security", icon: Shield },
                    { id: "admin", label: "Admin", icon: Briefcase },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full justify-start px-4 py-3 text-left rounded-lg transition-all flex items-center text-base ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  ))}

                  <Button
                    variant="outline"
                    className="justify-center px-4 py-2 mt-2 text-white border-0 hover:opacity-90 hover:text-white rounded-lg text-sm"
                    style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}
                    onClick={() => {
                      window.location.href = "/dashboard"
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 flex-shrink-0"
                    >
                      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" />
                      <path d="M5 3v4" />
                      <path d="M3 5h4" />
                      <path d="M19 17v4" />
                      <path d="M17 19h4" />
                    </svg>
                    <span className="truncate">{accountInfo.fullName} AI</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="w-full justify-start px-6 py-2 bg-white border-b border-gray-200 rounded-none h-auto overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {[
                  { id: "basic", label: "Basic", icon: User },
                  { id: "social", label: "Social", icon: Globe },
                  { id: "security", label: "Security", icon: Shield },
                  { id: "admin", label: "Admin", icon: Briefcase },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap text-sm transition-all min-w-max ${
                      activeTab === tab.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden" style={{ height: "100%" }}>
            <div className="hidden lg:flex flex-shrink-0 p-6 border-b border-gray-200 bg-white dark:bg-gray-900 items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">{activeTab}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {activeTab === "basic" && "Manage your basic account information and preferences."}
                  {activeTab === "social" && "Connect and manage your social media accounts."}
                  {activeTab === "security" && "Update your security settings and password."}
                  {activeTab === "admin" && "Manage users and their permissions in the system."}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div
              className="flex-1 p-4 sm:p-6 space-y-6"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div className="lg:hidden mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 capitalize">{activeTab}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {activeTab === "basic" && "Manage your basic account information and preferences."}
                  {activeTab === "social" && "Connect and manage your social media accounts."}
                  {activeTab === "security" && "Update your security settings and password."}
                  {activeTab === "admin" && "Manage users and their permissions in the system."}
                </p>
              </div>

              {activeTab === "basic" && (
                <div className="max-w-2xl space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-500 dark:text-gray-400 text-base">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={accountInfo.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-500 dark:text-gray-400 text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-500 dark:text-gray-400 text-base">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={accountInfo.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-500 dark:text-gray-400 text-base">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={accountInfo.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about" className="text-gray-500 dark:text-gray-400 text-base">
                      About
                    </Label>
                    <Textarea
                      id="about"
                      value={accountInfo.about}
                      onChange={(e) => handleInputChange("about", e.target.value)}
                      rows={4}
                      className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === "social" && (
                <div className="max-w-2xl space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-gray-500 dark:text-gray-400 text-base">
                      Facebook
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <div className="bg-[#1877F2] text-white rounded w-8 h-8 flex items-center justify-center">
                          <span className="font-bold text-sm">f</span>
                        </div>
                      </div>
                      <Input
                        id="facebook"
                        placeholder="Facebook Username"
                        value={accountInfo.facebook}
                        onChange={(e) => handleInputChange("facebook", e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 pl-16"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-gray-500 dark:text-gray-400 text-base">
                      LinkedIn
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <div className="bg-[#0A66C2] text-white rounded w-8 h-8 flex items-center justify-center">
                          <span className="font-bold text-xs">in</span>
                        </div>
                      </div>
                      <Input
                        id="linkedin"
                        placeholder="LinkedIn Username"
                        value={accountInfo.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 pl-16"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-gray-500 dark:text-gray-400 text-base">
                      X
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <div className="bg-black text-white rounded w-8 h-8 flex items-center justify-center">
                          <span className="font-bold text-sm">X</span>
                        </div>
                      </div>
                      <Input
                        id="twitter"
                        placeholder="X Username"
                        value={accountInfo.twitter}
                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                        className="w-full bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-base py-3 pl-16"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="max-w-md mx-auto text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 mb-6">
                      <Shield className="h-20 w-20 mx-auto" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Security Settings</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Click to reset your password.</p>
                    <Button
                      className="w-full hover:opacity-90 text-white"
                      style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}
                      onClick={handlePasswordReset}
                    >
                      Send Password Reset Link
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-6">User Management</h4>

                  <div className="relative mb-6 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search Users"
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="hidden sm:grid grid-cols-3 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Role</div>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-1 sm:grid-cols-3 px-4 sm:px-6 py-4 gap-2 sm:gap-0 sm:items-center"
                        >
                          <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">Name</div>
                          <div className="text-gray-900 dark:text-gray-100 font-medium sm:font-normal">{user.name}</div>

                          <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                            Email
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base break-all sm:break-normal">
                            {user.email}
                          </div>

                          <div className="flex justify-between items-center mt-2 sm:mt-0 sm:justify-end">
                            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 font-medium">Role</div>
                            <Select
                              value={user.role}
                              onValueChange={(value: "Admin" | "Student") => handleRoleChange(user.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}

                      {filteredUsers.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No users found</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {activeTab !== "security" && (
              <div className="flex-shrink-0 border-t border-gray-200 p-4 sm:p-6 bg-white dark:bg-gray-900">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
<Button
                onClick={handleSave}
                className="hover:opacity-90 text-white w-full sm:w-auto"
                style={{ background: "linear-gradient(135deg, #38A1E5 0%, #7284FF 100%)" }}
              >
                Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
