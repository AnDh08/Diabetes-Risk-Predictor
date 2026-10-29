import { useState } from 'react'
import {
    defaultPredictionFormData,
    type PredictionFormData,
    type PredictionRequest,
} from '../types/prediction'

type DiabetesRiskFormProps = {
    onSubmit?: (data: PredictionRequest) => void | Promise<void>
    isLoading?: boolean
}

type ValidationError = {
    id: string
    message: string
}

const getValidationError = (control: HTMLInputElement | HTMLSelectElement): ValidationError | null => {
    const { validity } = control

    if (validity.valid) {
        return null
    }

    const label = control.labels?.[0]?.textContent?.trim().replace(/:$/, '') ?? 'This field'
    let message = `${label} is invalid.`

    if (validity.valueMissing) {
        message = `${label}: please provide an answer.`
    } else if (validity.rangeUnderflow || validity.rangeOverflow) {
        message = `${label}: enter a value from ${control.getAttribute('min')} to ${control.getAttribute('max')}.`
    } else if (validity.stepMismatch) {
        message = `${label}: use increments of ${control.getAttribute('step')}.`
    } else if (validity.badInput) {
        message = `${label}: enter a valid number.`
    }

    return { id: control.id, message }
}

const DiabetesRiskForm = ({ onSubmit, isLoading = false }: DiabetesRiskFormProps) => {
    const [formData, setFormData] = useState<PredictionFormData>(defaultPredictionFormData)
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
    const getFieldAccessibilityProps = (id: string) => {
        const hasError = validationErrors.some((error) => error.id === id)

        return {
            'aria-invalid': hasError || undefined,
            'aria-describedby': hasError ? `${id}-error` : undefined,
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        const updatedError = getValidationError(event.target)

        setFormData((currentData) => ({
            ...currentData,
            [name]: value === '' ? '' : Number(value)
        }))
        setValidationErrors((currentErrors) => [
            ...currentErrors.filter((error) => error.id !== event.target.id),
            ...(updatedError ? [updatedError] : []),
        ])
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const invalidControls = Array.from(event.currentTarget.elements).filter(
            (control): control is HTMLInputElement | HTMLSelectElement =>
                (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) &&
                !control.validity.valid,
        )
        const errors = invalidControls
            .map(getValidationError)
            .filter((error): error is ValidationError => error !== null)

        setValidationErrors(errors)

        if (errors.length > 0) {
            invalidControls[0]?.focus()
            return
        }

        const request = Object.fromEntries(
            Object.entries(formData).map(([field, value]) => [field, Number(value)]),
        ) as PredictionRequest

        onSubmit?.(request)
    }

    return (
        <form className="diabetes-form" onSubmit={handleSubmit} noValidate>
            <h1>Diabetes Risk Form</h1>
            <p className="form-disclaimer">This estimate is for informational purposes only and is not a medical diagnosis.</p>

            {validationErrors.length > 0 && (
                <div className="validation-errors" role="alert" aria-labelledby="validation-error-title">
                    <h2 id="validation-error-title">
                        Please fix {validationErrors.length} {validationErrors.length === 1 ? 'field' : 'fields'}
                    </h2>
                    <ul>
                        {validationErrors.map((error) => (
                            <li key={error.id} id={`${error.id}-error`}>
                                <a href={`#${error.id}`}>{error.message}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <fieldset className="form-section">
                <legend>Medical history</legend>

                <label htmlFor="HighBP">Diagnosed with high blood pressure?</label>
                <select
                    id="HighBP"
                    name="HighBP"
                    {...getFieldAccessibilityProps('HighBP')}
                    value={formData.HighBP}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="HighChol">Diagnosed with high cholesterol?</label>
                <select
                    id="HighChol"
                    name="HighChol"
                    {...getFieldAccessibilityProps('HighChol')}
                    value={formData.HighChol}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="CholCheck">Cholesterol checked within the past 5 years?</label>
                <select
                    id="CholCheck"
                    name="CholCheck"
                    {...getFieldAccessibilityProps('CholCheck')}
                    value={formData.CholCheck}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="BMI">Body mass index (BMI):</label>
                <input
                    id="BMI"
                    name="BMI"
                    {...getFieldAccessibilityProps('BMI')}
                    type="number"
                    min="10"
                    max="80"
                    step="0.1"
                    value={formData.BMI}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Smoker">Smoked at least 100 cigarettes in your lifetime?</label>
                <select
                    id="Smoker"
                    name="Smoker"
                    {...getFieldAccessibilityProps('Smoker')}
                    value={formData.Smoker}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="Stroke">Have you ever had a stroke?</label>
                <select
                    id="Stroke"
                    name="Stroke"
                    {...getFieldAccessibilityProps('Stroke')}
                    value={formData.Stroke}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="HeartDiseaseorAttack">History of heart disease or heart attack?</label>
                <select
                    id="HeartDiseaseorAttack"
                    name="HeartDiseaseorAttack"
                    {...getFieldAccessibilityProps('HeartDiseaseorAttack')}
                    value={formData.HeartDiseaseorAttack}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

            </fieldset>

            <fieldset className="form-section">
                <legend>Lifestyle</legend>

                <label htmlFor="PhysActivity">Did you do physical activity in the past 30 days?</label>
                <select
                    id="PhysActivity"
                    name="PhysActivity"
                    {...getFieldAccessibilityProps('PhysActivity')}
                    value={formData.PhysActivity}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="Fruits">Do you eat fruit at least once per day?</label>
                <select
                    id="Fruits"
                    name="Fruits"
                    {...getFieldAccessibilityProps('Fruits')}
                    value={formData.Fruits}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="Veggies">Do you eat vegetables at least once per day?</label>
                <select
                    id="Veggies"
                    name="Veggies"
                    {...getFieldAccessibilityProps('Veggies')}
                    value={formData.Veggies}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="HvyAlcoholConsump">Do you regularly consume a high amount of alcohol?</label>
                <select
                    id="HvyAlcoholConsump"
                    name="HvyAlcoholConsump"
                    {...getFieldAccessibilityProps('HvyAlcoholConsump')}
                    value={formData.HvyAlcoholConsump}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

            </fieldset>

            <fieldset className="form-section">
                <legend>Healthcare access</legend>

                <label htmlFor="AnyHealthcare">Do you have healthcare coverage?</label>
                <select
                    id="AnyHealthcare"
                    name="AnyHealthcare"
                    {...getFieldAccessibilityProps('AnyHealthcare')}
                    value={formData.AnyHealthcare}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

                <label htmlFor="NoDocbcCost">Have you avoided seeing a doctor because of cost?</label>
                <select
                    id="NoDocbcCost"
                    name="NoDocbcCost"
                    {...getFieldAccessibilityProps('NoDocbcCost')}
                    value={formData.NoDocbcCost}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

            </fieldset>

            <fieldset className="form-section">
                <legend>Wellbeing</legend>

                <label htmlFor="GenHlth">How would you rate your general health?</label>
                <select
                    id="GenHlth"
                    name="GenHlth"
                    {...getFieldAccessibilityProps('GenHlth')}
                    value={formData.GenHlth}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={1}>Excellent</option>
                    <option value={2}>Very Good</option>
                    <option value={3}>Good</option>
                    <option value={4}>Fair</option>
                    <option value={5}>Poor</option>
                </select>

                <label htmlFor="MentHlth">Days of poor mental health in the past 30 days:</label>
                <input
                    id="MentHlth"
                    name="MentHlth"
                    {...getFieldAccessibilityProps('MentHlth')}
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    value={formData.MentHlth}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="PhysHlth">Days of poor physical health in the past 30 days:</label>
                <input
                    id="PhysHlth"
                    name="PhysHlth"
                    {...getFieldAccessibilityProps('PhysHlth')}
                    type="number"
                    min="0"
                    max="30"
                    step="1"
                    value={formData.PhysHlth}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="DiffWalk">Do you have serious difficulty walking or climbing stairs?</label>
                <select
                    id="DiffWalk"
                    name="DiffWalk"
                    {...getFieldAccessibilityProps('DiffWalk')}
                    value={formData.DiffWalk}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>

            </fieldset>

            <fieldset className="form-section">
                <legend>Demographics</legend>

                <label htmlFor="Sex">Sex:</label>
                <select
                    id="Sex"
                    name="Sex"
                    {...getFieldAccessibilityProps('Sex')}
                    value={formData.Sex}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an answer</option>
                    <option value={0}>Female</option>
                    <option value={1}>Male</option>
                </select>

                <label htmlFor="Age">Age group:</label>
                <select
                    id="Age"
                    name="Age"
                    {...getFieldAccessibilityProps('Age')}
                    value={formData.Age}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an age group</option>
                    <option value={1}>18-24</option>
                    <option value={2}>25-29</option>
                    <option value={3}>30-34</option>
                    <option value={4}>35-39</option>
                    <option value={5}>40-44</option>
                    <option value={6}>45-49</option>
                    <option value={7}>50-54</option>
                    <option value={8}>55-59</option>
                    <option value={9}>60-64</option>
                    <option value={10}>65-69</option>
                    <option value={11}>70-74</option>
                    <option value={12}>75-79</option>
                    <option value={13}>80 or older</option>
                </select>
                <label htmlFor="Education">Highest level of education completed:</label>
                <select
                    id="Education"
                    name="Education"
                    {...getFieldAccessibilityProps('Education')}
                    value={formData.Education}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an education level</option>
                    <option value={1}>Never attended school or only kindergarten</option>
                    <option value={2}>Grades 1 through 8 (Elementary)</option>
                    <option value={3}>Grades 9 through 11 (Some high school)</option>
                    <option value={4}>Grade 12 or GED (High school graduate)</option>
                    <option value={5}>College 1 year to 3 years (Some college or technical school)</option>
                    <option value={6}>College 4 years or more (College graduate)</option>
                </select>
                <label htmlFor="Income">Annual household income:</label>
                <select
                    id="Income"
                    name="Income"
                    {...getFieldAccessibilityProps('Income')}
                    value={formData.Income}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select an income range</option>
                    <option value={1}>Less than $10,000</option>
                    <option value={2}>$10,000 to less than $15,000</option>
                    <option value={3}>$15,000 to less than $20,000</option>
                    <option value={4}>$20,000 to less than $25,000</option>
                    <option value={5}>$25,000 to less than $35,000</option>
                    <option value={6}>$35,000 to less than $50,000</option>
                    <option value={7}>$50,000 to less than $75,000</option>
                    <option value={8}>$75,000 or more</option>
                </select>
            </fieldset>

            <button className="submit-button" type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    )
}

export default DiabetesRiskForm