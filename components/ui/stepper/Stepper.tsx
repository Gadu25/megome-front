"use client"

import { useState } from "react"

export type Step = {
  id: string
  title: string
  description?: string
  render: () => React.ReactNode
  onNext?: () => Promise<boolean> | boolean
  onBack?: () => void
}

type StepperProps = {
  steps: Step[]
}

export default function Stepper({ steps }: StepperProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const currentStep = steps[stepIndex]

  const next = async () => {
    if (loading) return

    try {
      setLoading(true)
      const canProceed = await currentStep.onNext?.()
      
      if (canProceed === false) return

      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
    } finally {
      setLoading(false)
    }
  }

  const back = () => {
    if (stepIndex === 0) return
    currentStep.onBack?.()
    setStepIndex((prev) => prev - 1)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative mb-10">
          <div className="absolute top-3 left-0 right-0 h-[2px] bg-base-300" />
          <div
            className="absolute top-3 left-0 h-[2px] bg-primary transition-all"
            style={{
              width: `${(stepIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          <div className="relative flex justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className={`
                flex flex-col text-xs
                ${i === 0 ? "items-start" : ""}
                ${i === steps.length - 1 ? "items-end" : ""}
                ${i !== 0 && i !== steps.length - 1 ? "items-center" : ""}
              `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    transition-all
                    ${i <= stepIndex
                      ? "bg-primary text-white"
                      : "bg-base-200 text-base-content/60"}
                  `}
                >
                  {i + 1}
                </div>
                <span className={
                  `mt-2
                  ${i === stepIndex ? "font-medium" : "opacity-60"}
                  ${i === steps.length - 1 ? "text-end": ""}
                  max-w-[80px]`
                }>
                  {s.title}
                </span>
              </div>
            ))}

          </div>
        </div>
        
        <div className="mt-8 mb-6">
          <h2 className="text-xl font-semibold">
            {currentStep.title}
          </h2>

          {currentStep.description && (
            <p className="text-sm opacity-60 mt-1">
              {currentStep.description}
            </p>
          )}
        </div>
        
        <div>
          {currentStep.render()}
        </div>

        <div className="flex justify-between">
          <button
            className="btn"
            onClick={back}
            disabled={stepIndex === 0 || loading}
          >
            Back
          </button>

          <button
            className="btn btn-primary"
            onClick={next}
            disabled={loading}
          >
            {stepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

      </div>
      {loading && (
        <div className="fixed inset-0 bg-base-100/60 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </>
  )
}
