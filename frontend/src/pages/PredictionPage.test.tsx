import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { predictDiabetesRisk } from '../api/prediction'
import PredictionPage from './PredictionPage'

vi.mock('../api/prediction', () => ({
    predictDiabetesRisk: vi.fn(),
}))

describe('PredictionPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('handles a successful submission', async () => {
        vi.mocked(predictDiabetesRisk).mockResolvedValue({
            prediction: 1,
            probability: 0.73,
            risk_level: 'high_risk',
        })
        render(<PredictionPage />)

        fillForm()
        submitForm()

        expect(await screen.findByRole('heading', { name: 'High risk' })).toBeInTheDocument()
        expect(screen.getByText('73%')).toBeInTheDocument()
        expect(predictDiabetesRisk).toHaveBeenCalledOnce()
    })

    it('resets the form when starting a new assessment', async () => {
        vi.mocked(predictDiabetesRisk).mockResolvedValue({
            prediction: 1,
            probability: 0.73,
            risk_level: 'high_risk',
        })
        render(<PredictionPage />)

        fillForm()
        submitForm()

        expect(await screen.findByRole('heading', { name: 'High risk' })).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Start new assessment' }))

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'High risk' })).not.toBeInTheDocument()
            expect(screen.getByLabelText('Diagnosed with high blood pressure?')).toHaveValue('')
            expect(screen.getByLabelText('Diagnosed with high blood pressure?')).toHaveFocus()
        })
    })

    it('shows loading state while the request is pending', () => {
        vi.mocked(predictDiabetesRisk).mockReturnValue(new Promise(() => undefined))
        render(<PredictionPage />)

        fillForm()
        submitForm()

        expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()
    })

    it('shows an error when the API rejects the request', async () => {
        vi.mocked(predictDiabetesRisk).mockRejectedValue(new Error('Prediction request failed: 422'))
        render(<PredictionPage />)

        fillForm()
        submitForm()

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'The prediction request was rejected. Please check your answers and try again.',
        )
        expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    })

    it('shows an error when the network request fails', async () => {
        vi.mocked(predictDiabetesRisk).mockRejectedValue(new Error('Failed to fetch'))
        render(<PredictionPage />)

        fillForm()
        submitForm()

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Unable to connect to the prediction service. Please try again.',
        )
    })

    it('prevents duplicate submissions while loading', async () => {
        let resolveRequest: () => void = () => undefined
        vi.mocked(predictDiabetesRisk).mockReturnValue(new Promise((resolve) => {
            resolveRequest = () => resolve({ prediction: 0, probability: 0.2, risk_level: 'low_risk' })
        }))
        render(<PredictionPage />)

        fillForm()
        submitForm()
        submitForm()

        expect(predictDiabetesRisk).toHaveBeenCalledOnce()

        resolveRequest()
        await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())
    })
})

const fillForm = () => {
    screen.getAllByRole('combobox').forEach((select) => {
        fireEvent.change(select, { target: { value: select.id === 'GenHlth' ? '3' : '1' } })
    })
    fireEvent.change(screen.getByLabelText('Body mass index (BMI):'), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText('Days of poor mental health in the past 30 days:'), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText('Days of poor physical health in the past 30 days:'), { target: { value: '0' } })

}

const submitForm = () => {
    fireEvent.submit(screen.getByRole('button', { name: /Submit/ }).closest('form') as HTMLFormElement)
}