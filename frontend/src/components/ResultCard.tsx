import type { PredictionResponse } from '../types/prediction'

type ResultCardProps = {
    prediction: PredictionResponse
    onStartNewAssessment: () => void
}

const ResultCard = ({ prediction, onStartNewAssessment }: ResultCardProps) => {
    const percentage = Number((prediction.probability * 100).toFixed(1))
    const percentageForScale = Math.min(100, Math.max(0, percentage))
    const riskLabel = prediction.risk_level === 'high_risk' ? 'High risk' : 'Low risk'

    return (
        <section className={`result-card ${prediction.risk_level}`} aria-labelledby="result-card-title">
            <p className="result-card__eyebrow">Prediction result</p>
            <h2 id="result-card-title">{riskLabel}</h2>
            <div className="result-card__probability">
                <div className="result-card__probability-header">
                    <span>Estimated probability</span>
                    <strong>{percentage}%</strong>
                </div>
                <div
                    className="result-card__scale"
                    role="progressbar"
                    aria-label="Estimated diabetes risk probability"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentageForScale}
                    aria-valuetext={`${percentage}% probability`}
                >
                    <span
                        className="result-card__scale-fill"
                        style={{ width: `${percentageForScale}%` }}
                    />
                </div>
                <div className="result-card__scale-labels" aria-hidden="true">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>
            <p className="result-card__disclaimer">
                This estimate is for informational purposes only and is not a medical diagnosis.
            </p>
            <button type="button" className="new-assessment-button" onClick={onStartNewAssessment}>
                Start new assessment
            </button>
        </section>
    )
}

export default ResultCard