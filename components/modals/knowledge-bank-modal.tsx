"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Database, FileText, X } from "lucide-react"

interface KnowledgeBankItem {
  id: string
  name: string
  type: string
  tokens: number
  dateAdded: string
}

interface KnowledgeBankModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDatasets: (datasets: KnowledgeBankItem[]) => void
}

const mockKnowledgeBankItems: KnowledgeBankItem[] = [
  { id: "1", name: "Company Handbook", type: "PDF", tokens: 15420, dateAdded: "2024-01-15" },
  { id: "2", name: "Product Documentation", type: "URL", tokens: 8750, dateAdded: "2024-02-20" },
  { id: "3", name: "FAQ Database", type: "Text", tokens: 3200, dateAdded: "2024-03-10" },
  { id: "4", name: "Training Materials", type: "PDF", tokens: 22100, dateAdded: "2024-03-25" },
  { id: "5", name: "Customer Support Guides", type: "URL", tokens: 6800, dateAdded: "2024-04-05" },
]

export function KnowledgeBankModal({ isOpen, onClose, onAddDatasets }: KnowledgeBankModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const filteredItems = mockKnowledgeBankItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const handleAddSelected = () => {
    const selectedDatasets = mockKnowledgeBankItems.filter((item) => selectedItems.includes(item.id))
    onAddDatasets(selectedDatasets)
    setSelectedItems([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-[var(--sidebar-foreground)]">
            <Database className="w-5 h-5 text-blue-500" />
            Knowledge Bank
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search knowledge bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                {selectedItems.length > 0 ? `${selectedItems.length} selected` : "Select all"}
              </span>
            </div>
            <span className="text-sm text-gray-500">{filteredItems.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedItems.includes(item.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                }`}
                onClick={() => handleToggleItem(item.id)}
              >
                <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => handleToggleItem(item.id)} />
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.type} • {item.tokens.toLocaleString()} tokens • Added {item.dateAdded}
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">No items found matching your search.</div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleAddSelected}
              disabled={selectedItems.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Selected ({selectedItems.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
