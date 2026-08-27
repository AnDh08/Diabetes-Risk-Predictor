import type { PredictionRequest, PredictionResponse } from '../types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured')
}

export async function predictDiabetesRisk(request: PredictionRequest): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error(`Prediction request failed: ${response.status}`)
    }
    
    return response.json() as Promise<PredictionResponse>
}