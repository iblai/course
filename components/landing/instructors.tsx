import { Card, CardContent } from "@/components/ui/card"

const topics = [
  {
    id: 1,
    title: "Artificial Intelligence for Business Leaders",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    title: "Prompt Engineering & Applied Generative AI",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    title: "Data Analytics & Visualization with Excel and Power BI",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    title: "Machine Learning for Decision-Makers",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    title: "Digital Transformation Strategy",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function Instructors() {
  return (
    <section id="instructors" className="py-20 lg:py-28 bg-[var(--accent-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 rounded-full border border-[var(--border-color)] bg-[var(--card-bg)] text-sm font-medium text-text-primary mb-4">
            Instructors
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-balance">AI, Data & Digital Literacy</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Learn from expert instructors across various cutting-edge domains
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-[var(--border-color)] hover:border-[var(--primary-color)]/30 bg-[var(--card-bg)]"
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-[var(--accent-color-2)]">
                  <img
                    src={topic.image || "/placeholder.svg"}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-text-primary leading-tight group-hover:text-brand-primary transition-colors">
                  {topic.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
