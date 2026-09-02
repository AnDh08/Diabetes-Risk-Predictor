import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';
import { predictDiabetesRisk } from './prediction';

const request: PredictionRequest = {
    HighBP: 1,
    HighChol: 0,
    CholCheck: 1,
    BMI: 25,
    Smoker: 0,
    Stroke: 0,
    HeartDiseaseorAttack: 0,
    PhysActivity: 1,
    Fruits: 1,
    Veggies: 1,
    HvyAlcoholConsump: 0,
    AnyHealthcare: 1,
    NoDocbcCost: 0,
    GenHlth: 3,
    MentHlth: 0,
    PhysHlth: 0,
    DiffWalk: 0,
    Sex: 1,
    Age: 9,
    Education: 5,
    Income: 6,
}

describe('predictDiabetesRisk', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('sends a prediction request and returns the response', async () => {
        const predictionResponse: PredictionResponse = {
            prediction: 1,
            probability: 0.73,
            risk_level: 'high_risk' as const,
        }

        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(
                new Response(JSON.stringify(predictionResponse), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            )

        const result = await predictDiabetesRisk(request)

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringMatching(/\/predict$/),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            },
        )

        expect(result).toEqual(predictionResponse)
    })

    it('throws when the backend returns an HTTP error', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('Invalid request', { status: 422 }),
        )

        await expect(predictDiabetesRisk(request)).rejects.toThrow(
            'Prediction request failed: 422',
        )
    })

    it('propagates network errors', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(
            new Error('Network unavailable'),
        )

        await expect(predictDiabetesRisk(request)).rejects.toThrow(
            'Network unavailable',
        )
    })
})