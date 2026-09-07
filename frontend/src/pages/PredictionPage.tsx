import { useState } from 'react'
import { predictDiabetesRisk } from '../api/prediction'
import DiabetesRiskForm from '../components/DiabetesRiskForm'
import type { PredictionRequest, PredictionResponse } from '../types/prediction'

const PredictionPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null)

    const handleSubmit = async (request: PredictionRequest) => {
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
            setIsLoading(false)
        }
    }

    return (
        <main>
            <DiabetesRiskForm onSubmit={handleSubmit} isLoading={isLoading} />

            {error && <p role="alert">{error}</p>}

            {prediction && (
                <p role="status">
                    Prediction: {prediction.risk_level} ({Math.round(prediction.probability * 100)}% probability)
                </p>
            )}
        </main>
    )
}

export default PredictionPage