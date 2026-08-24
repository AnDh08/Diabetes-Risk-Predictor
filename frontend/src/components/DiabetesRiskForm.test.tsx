import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DiabetesRiskForm from './DiabetesRiskForm'

describe('DiabetesRiskForm', () => {
    it('renders all 21 prediction fields', () => {
        render(<DiabetesRiskForm />)

        expect(screen.getByLabelText('Diagnosed with high blood pressure?')).toBeInTheDocument()
        expect(screen.getByLabelText('Diagnosed with high cholesterol?')).toBeInTheDocument()
        expect(screen.getByLabelText('Cholesterol checked within the past 5 years?')).toBeInTheDocument()
        expect(screen.getByLabelText('Body mass index (BMI):')).toBeInTheDocument()
        expect(screen.getByLabelText('Annual household income:')).toBeInTheDocument()
        expect(screen.getAllByRole('combobox')).toHaveLength(18)
        expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
    })

    it('starts with unanswered fields', () => {
        render(<DiabetesRiskForm />)

        expect(screen.getByLabelText('Diagnosed with high blood pressure?')).toHaveValue('')
        expect(screen.getByLabelText('Body mass index (BMI):')).toHaveValue(null)
        screen.getAllByRole('combobox').forEach((select) => {
            expect(select).toHaveValue('')
        })
    })

    it('blocks submission when required fields are empty', () => {
        const onSubmit = vi.fn()
        render(<DiabetesRiskForm onSubmit={onSubmit} />)

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))

        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('blocks submission when BMI is outside the allowed range', () => {
        const onSubmit = vi.fn()
        render(<DiabetesRiskForm onSubmit={onSubmit} />)

        fireEvent.change(screen.getByLabelText('Body mass index (BMI):'), { target: { value: '5' } })
        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))

        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('blocks submission when health days exceed 30', () => {
        const onSubmit = vi.fn()
        render(<DiabetesRiskForm onSubmit={onSubmit} />)

        fireEvent.change(screen.getByLabelText('Days of poor mental health in the past 30 days:'), { target: { value: '31' } })
        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))

        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('submits valid values', () => {
        const onSubmit = vi.fn()
        render(<DiabetesRiskForm onSubmit={onSubmit} />)

        screen.getAllByRole('combobox').forEach((select) => {
            fireEvent.change(select, { target: { value: select.id === 'GenHlth' ? '3' : '1' } })
        })
        fireEvent.change(screen.getByLabelText('Body mass index (BMI):'), { target: { value: '25' } })
        fireEvent.change(screen.getByLabelText('Days of poor mental health in the past 30 days:'), { target: { value: '0' } })
        fireEvent.change(screen.getByLabelText('Days of poor physical health in the past 30 days:'), { target: { value: '0' } })

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }))

        expect(onSubmit).toHaveBeenCalledOnce()
        expect(onSubmit.mock.calls[0][0]).toMatchObject({ BMI: 25, GenHlth: 3 })
    })
})