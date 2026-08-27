export type PredictionFormData = {
    HighBP: number | '';
    HighChol: number | '';
    CholCheck: number | '';
    BMI: number | '';
    Smoker: number | '';
    Stroke: number | '';
    HeartDiseaseorAttack: number | '';
    PhysActivity: number | '';
    Fruits: number | '';
    Veggies: number | '';
    HvyAlcoholConsump: number | '';
    AnyHealthcare: number | '';
    NoDocbcCost: number | '';
    GenHlth: number | '';
    MentHlth: number | '';
    PhysHlth: number | '';
    DiffWalk: number | ''
    Sex: number | '';
    Age: number | '';
    Education: number | '';
    Income: number | '';
};

export const defaultPredictionFormData: PredictionFormData = {
    HighBP: '',
    HighChol: '',
    CholCheck: '',
    BMI: '',
    Smoker: '',
    Stroke: '',
    HeartDiseaseorAttack: '',
    PhysActivity: '',
    Fruits: '',
    Veggies: '',
    HvyAlcoholConsump: '',
    AnyHealthcare: '',
    NoDocbcCost: '',
    GenHlth: '',
    MentHlth: '',
    PhysHlth: '',
    DiffWalk: '',
    Sex: '',
    Age: '',
    Education: '',
    Income: '',
};

export type PredictionRequest = {
    HighBP: number;
    HighChol: number;
    CholCheck: number;
    BMI: number;
    Smoker: number;
    Stroke: number;
    HeartDiseaseorAttack: number;
    PhysActivity: number;
    Fruits: number;
    Veggies: number;
    HvyAlcoholConsump: number;
    AnyHealthcare: number;
    NoDocbcCost: number;
    GenHlth: number;
    MentHlth: number;
    PhysHlth: number;
    DiffWalk: number;
    Sex: number;
    Age: number;
    Education: number;
    Income: number;
}

export type PredictionResponse = {
    prediction: 0 | 1;
    probability: number;
    risk_level: 'low_risk' | 'high_risk';
}