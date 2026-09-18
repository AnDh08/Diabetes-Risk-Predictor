import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ResultCard from './ResultCard'
import type { PredictionResponse } from '../types/prediction'

const renderResultCard = (prediction: PredictionResponse) => {
    const onStartNewAssessment = vi.fn()

    render(
        <ResultCard
            prediction={prediction}
            onStartNewAssessment={onStartNewAssessment}
        />,
    )

    return { onStartNewAssessment }
}

describe('ResultCard', () => {
    it('displays a low-risk result with its formatted probability', () => {
        renderResultCard({
            prediction: 0,
            probability: 0.35,
            risk_level: 'low_risk',
        })

        expect(screen.getByRole('heading', { name: 'Low risk' })).toBeInTheDocument()
        expect(screen.getByText('Estimated probability')).toBeInTheDocument()
        expect(screen.getByText('35%')).toBeInTheDocument()
        const progressbar = screen.getByRole('progressbar')

        expect(progressbar).toHaveAttribute('aria-valuetext', '35% probability')
        expect(progressbar.querySelector('.result-card__scale-fill')).toHaveStyle({ width: '35%' })
    })

    it('displays a high-risk result with decimal probability formatting', () => {
        renderResultCard({
            prediction: 1,
            probability: 0.724,
            risk_level: 'high_risk',
        })

        expect(screen.getByRole('heading', { name: 'High risk' })).toBeInTheDocument()
        expect(screen.getByText('72.4%')).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '72.4')
    })

    it.each([
        { probability: 0, label: '0%', riskLevel: 'Low risk' },
        { probability: 1, label: '100%', riskLevel: 'High risk' },
    ])('formats a boundary probability of $label', ({ probability, label, riskLevel }) => {
        renderResultCard({
            prediction: probability === 1 ? 1 : 0,
            probability,
            risk_level: probability === 1 ? 'high_risk' : 'low_risk',
        })

        expect(screen.getByRole('heading', { name: riskLevel })).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', `${label} probability`)
    })

    it('calls the new-assessment handler when requested', async () => {
        const { onStartNewAssessment } = renderResultCard({
            prediction: 0,
            probability: 0.2,
            risk_level: 'low_risk',
        })

        await screen.getByRole('button', { name: 'Start new assessment' }).click()

        expect(onStartNewAssessment).toHaveBeenCalledOnce()
    })
})
