import { useEffect, useRef, useState } from 'react'
import { predictDiabetesRisk } from '../api/prediction'
import DiabetesRiskForm from '../components/DiabetesRiskForm'
import ResultCard from '../components/ResultCard'
import type { PredictionRequest, PredictionResponse } from '../types/prediction'

const PredictionPage = () => {
    const isSubmitting = useRef(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
    const [formVersion, setFormVersion] = useState(0)
    const formRef = useRef<HTMLDivElement | null>(null)
    const resultRef = useRef<HTMLDivElement | null>(null)
    const shouldFocusForm = useRef(false)

    useEffect(() => {
        if (!shouldFocusForm.current) {
            return
        }

        shouldFocusForm.current = false
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        formRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
        })
        formRef.current?.querySelector<HTMLElement>('#HighBP')?.focus({ preventScroll: true })
    }, [formVersion])

    useEffect(() => {
        if (!prediction) {
            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        resultRef.current?.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
        })
    }, [prediction])

    const handleSubmit = async (request: PredictionRequest) => {
        if (isSubmitting.current) {
            return
        }

        isSubmitting.current = true
        setIsLoading(true)
        setError(null)
        setPrediction(null)

        try {
            const response = await predictDiabetesRisk(request)
            setPrediction(response)
        } catch (requestError) {
            const errorMessage = requestError instanceof Error ? requestError.message : ''
            const isApiError = errorMessage.startsWith('Prediction request failed:')

            setError(
                isApiError
                    ? 'The prediction request was rejected. Please check your answers and try again.'
                    : 'Unable to connect to the prediction service. Please try again.',
            )
        } finally {
            isSubmitting.current = false
            setIsLoading(false)
        }
    }

    const handleStartNewAssessment = () => {
        setError(null)
        setPrediction(null)
        shouldFocusForm.current = true
        setFormVersion((version) => version + 1)
    }

    return (
        <main>
            <div ref={formRef}>
                <DiabetesRiskForm key={formVersion} onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {error && <p role="alert">{error}</p>}

            {prediction && (
                <div ref={resultRef}>
                    <ResultCard prediction={prediction} onStartNewAssessment={handleStartNewAssessment} />
                </div>
            )}
        </main>
    )
}

export default PredictionPage