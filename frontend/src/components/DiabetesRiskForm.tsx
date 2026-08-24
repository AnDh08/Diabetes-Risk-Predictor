import { useState } from 'react'
import { defaultPredictionFormData, type PredictionFormData } from '../types/prediction'

const DiabetesRiskForm = () => {
    const [formData, setFormData] = useState<PredictionFormData>(defaultPredictionFormData)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value === '' ? '' : Number(value)
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!event.currentTarget.reportValidity()) {
            return
        }

        console.log('Form submitted:', formData)
    }

    return (
        <form className="diabetes-form" onSubmit={handleSubmit}>
            <h1>Diabetes Risk Form</h1>
            <p className="form-disclaimer">This estimate is for informational purposes only and is not a medical diagnosis.</p>

            <fieldset className="form-section">
                <legend>Medical history</legend>

                <label htmlFor="HighBP">Diagnosed with high blood pressure?</label>
                <select
                    id="HighBP"
                    name="HighBP"
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

            <button className="submit-button" type="submit">Submit</button>
        </form>
    )
}

export default DiabetesRiskForm