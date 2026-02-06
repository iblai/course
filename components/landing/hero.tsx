import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--accent-color)] py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gradient text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary text-balance">
              Master In-Demand Skills with <span className="text-brand-primary">Personalized AI</span>
            </h1>

            <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Help us customizing a learning plan for you. Our AI-powered platform creates personalized learning paths
              tailored to your goals and pace.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2 bg-brand-gradient hover:opacity-90 text-white">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-white border-[var(--border-color)] text-text-primary hover:bg-accent-blue"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">10K+</p>
                <p className="text-sm text-text-secondary">Active Learners</p>
              </div>
              <div className="h-10 w-px bg-[var(--border-color)]" />
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">200+</p>
                <p className="text-sm text-text-secondary">Expert Courses</p>
              </div>
              <div className="h-10 w-px bg-[var(--border-color)]" />
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">95%</p>
                <p className="text-sm text-text-secondary">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--primary-light)]/10 p-6">
                <div className="bg-[var(--card-bg)] rounded-xl shadow-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-primary">Mikel AI</p>
                      <p className="text-xs text-text-secondary">Your learning assistant</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Help us customizing a learning plan for you. If you prefer a voice conversation tap the blue button
                    below. Ready?
                  </p>
                </div>
                <div className="bg-[var(--card-bg)] rounded-xl shadow-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Learning analytics visualization"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <span className="inline-block px-3 py-1 bg-brand-gradient text-white text-xs font-medium rounded-full">
                      Beginner
                    </span>
                    <p className="mt-2 text-sm font-medium text-text-primary">Your Custom Learning Path</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--primary-light)]/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--primary-color)]/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
