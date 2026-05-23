"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { useGetMentorsQuery } from "@iblai/iblai-js/data-layer"
import { useUrlContext } from "@/lib/iblai/use-url-context"

/**
 * Selection row exposed to the parent. Mirrors the SDK mentor shape so
 * the sidebar's `onCreateProject` callback can extract `unique_id`
 * directly. The legacy `id / title / description / avatar` keys are
 * filled from the SDK row so any existing v0 call-sites keep
 * compiling.
 */
export interface Mentor {
  unique_id: string
  id: string | number
  title: string
  description: string
  avatar: string
  updatedDate: string
}

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject?: (projectName: string, selectedMentors: Mentor[]) => void
}

type SdkMentor = {
  id?: number | string
  unique_id?: string | null
  name?: string | null
  description?: string | null
  profile_image?: string | null
  updated_at?: string | null
}

const MENTORS_PER_PAGE = 8

/**
 * Create-project modal -- name + agent picker. Replaces the v0 fake
 * mentor catalog (`@/data/mentors`) with live `useGetMentorsQuery`
 * results so the user sees real tenant agents. Mirrors mentorai's
 * `CreateProjectModal` shape (agent grid + search + pagination); the
 * actual project-create mutation lives in the parent's
 * `onCreateProject` callback to keep one mutation site.
 */
export function CreateProjectModal({ isOpen, onClose, onCreateProject }: CreateProjectModalProps) {
  const { tenantKey, username } = useUrlContext()
  const [projectName, setProjectName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const { data: mentorsQueryData, isFetching: isLoadingMentors } =
    useGetMentorsQuery(
      {
        org: tenantKey,
        username: username ?? "",
        limit: 100,
      } as never,
      { skip: !tenantKey || !username || !isOpen },
    )
  const sdkMentors: SdkMentor[] =
    (mentorsQueryData as { results?: SdkMentor[] } | undefined)?.results ?? []

  const mentors: Mentor[] = useMemo(
    () =>
      sdkMentors
        .filter((m) => typeof m.unique_id === "string" && m.unique_id.length > 0)
        .map((m) => ({
          unique_id: m.unique_id as string,
          id: m.id ?? (m.unique_id as string),
          title: m.name ?? "Untitled agent",
          description: m.description ?? "",
          avatar: m.profile_image ?? "",
          updatedDate: m.updated_at ?? "",
        })),
    [sdkMentors],
  )

  const filteredMentors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return mentors
    return mentors.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q),
    )
  }, [mentors, searchQuery])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMentors.length / MENTORS_PER_PAGE),
  )
  const pageStart = (currentPage - 1) * MENTORS_PER_PAGE
  const pageMentors = filteredMentors.slice(
    pageStart,
    pageStart + MENTORS_PER_PAGE,
  )

  const isSelected = (m: Mentor) =>
    selectedMentors.some((s) => s.unique_id === m.unique_id)

  const toggleMentor = (m: Mentor) => {
    setSelectedMentors((prev) =>
      prev.some((s) => s.unique_id === m.unique_id)
        ? prev.filter((s) => s.unique_id !== m.unique_id)
        : [...prev, m],
    )
  }

  const reset = () => {
    setProjectName("")
    setSelectedMentors([])
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleSubmit = () => {
    if (!projectName.trim() || selectedMentors.length === 0) return
    onCreateProject?.(projectName.trim(), selectedMentors)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] max-w-4xl gap-0 overflow-hidden p-0"
        style={{
          height: "auto",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            New Project
          </DialogTitle>
        </div>

        <div
          className="flex-1 space-y-6 px-6 py-6"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="h-12 rounded-lg border-2 border-gray-200 px-4 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Select Agents <span className="text-red-500">*</span>
              {selectedMentors.length > 0 && (
                <span className="ml-2 font-normal text-blue-600">
                  ({selectedMentors.length} selected)
                </span>
              )}
            </label>

            <div className="mb-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search agents…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-10 pl-9"
              />
            </div>

            {isLoadingMentors ? (
              <div className="flex h-[360px] items-center justify-center text-sm text-gray-500">
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Loading agents…
              </div>
            ) : mentors.length === 0 ? (
              <div className="flex h-[360px] items-center justify-center text-sm text-gray-500">
                No agents available on this tenant yet.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {pageMentors.map((m) => {
                    const selected = isSelected(m)
                    return (
                      <button
                        key={m.unique_id}
                        type="button"
                        onClick={() => toggleMentor(m)}
                        className={`relative flex h-[160px] flex-col rounded-lg border-2 p-3 text-left transition-colors ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {selected && (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        <div className="mb-2 flex items-center gap-2">
                          {m.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.avatar}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-semibold text-white">
                              {m.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="line-clamp-2 text-sm font-medium text-gray-900">
                            {m.title}
                          </span>
                        </div>
                        <span className="line-clamp-3 text-xs text-gray-500">
                          {m.description}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!projectName.trim() || selectedMentors.length === 0}
            className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] px-6 text-white hover:opacity-90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
