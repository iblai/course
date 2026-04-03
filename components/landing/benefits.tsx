import { Sparkles, Target, Clock, Users, Award, TrendingUp } from "lucide-react"

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Personalization",
    description:
      "Our AI assistant Mikel creates custom learning paths tailored to your goals, pace, and learning style.",
  },
  {
    icon: Target,
    title: "Goal-Oriented Learning",
    description: "Set clear objectives and track your progress with milestone-based achievements.",
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description: "Flexible scheduling that adapts to your busy lifestyle. Learn anytime, anywhere.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from industry professionals with real-world experience in AI, data, and digital literacy.",
  },
  {
    icon: Award,
    title: "Recognized Certificates",
    description: "Earn certificates upon completion to showcase your skills to employers.",
  },
  {
    icon: TrendingUp,
    title: "Career Advancement",
    description: "Gain in-demand skills that employers are actively seeking in today's job market.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="py-20 lg:py-28 bg-[var(--accent-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-balance">Why Choose wink.school?</h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Experience a new way of learning with our cutting-edge platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-[var(--card-bg)] rounded-xl p-6 shadow-sm border border-[var(--border-color)] hover:shadow-md hover:border-[var(--primary-color)]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-color)]/10 flex items-center justify-center mb-4 group-hover:bg-brand-gradient transition-all">
                <benefit.icon className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{benefit.title}</h3>
              <p className="text-text-secondary leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
