"use client"

interface AssessmentsTabProps {
  onPromptClick?: (prompt: string) => void
}

export function AssessmentsTab({ onPromptClick }: AssessmentsTabProps) {
  const assessmentOptions = [
    "Multiple Choice, Quiz, or Test",
    "Rubric", // Updated "Rubric Generator" to "Rubric" to match the screenshot exactly
    "Questions Based on Text",
    "Progress Report",
    "AI Resistant Assignments",
    "Text Analysis Assignments",
    "SAT Math Practice",
    "Writing Feedback",
    "YouTube Questions",
    "Instructor Observations",
  ]

  const handleOptionClick = (option: string) => {
    if (onPromptClick) {
      onPromptClick(`Create ${option.toLowerCase()}`)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 px-0 py-0">
      {assessmentOptions.map((option, index) => (
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
