"use client"

interface CommunicationTabProps {
  onPromptClick?: (prompt: string) => void
}

export function CommunicationTab({ onPromptClick }: CommunicationTabProps) {
  const communicationOptions = [
    "Email",
    "Newsletter",
    "Letter of Recommendation",
    "Survey Creator",
    "Thank You Note",
    "Social Media Post",
  ]

  const handleOptionClick = (option: string) => {
    if (onPromptClick) {
      onPromptClick(option)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 px-0 py-0">
      {communicationOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option)}
          className="p-4 rounded-lg text-left transition-colors duration-200 py-2.5"
          style={{
            backgroundColor: "var(--accent-color)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--chat-hover-bg)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-color)"
          }}
        >
          <span className="text-sm font-medium">{option}</span>
        </button>
      ))}
    </div>
  )
}
