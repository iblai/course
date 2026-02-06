import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, BookOpen, Trophy } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Talk to Mikel AI",
    description:
      "Have a conversation with our AI assistant to understand your goals, current skill level, and learning preferences.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Get Your Custom Path",
    description:
      "Receive a personalized learning plan with curated courses, recommended order, and estimated completion time.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Start Learning & Earn",
    description:
      "Begin your journey, track progress, complete courses, and earn certificates to showcase your achievements.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-balance">How It Works</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-[var(--border-color)]" />
              )}

              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gradient text-white text-xl font-bold mb-6">
                {step.number}
              </div>

              <div className="w-14 h-14 rounded-xl bg-[var(--primary-color)]/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-7 h-7 text-brand-primary" />
              </div>

              <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button size="lg" className="gap-2 bg-brand-gradient hover:opacity-90 text-white">
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
