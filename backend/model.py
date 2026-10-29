import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, classification_report

CATEGORICAL_COLS = [
    'gender', 'Partner', 'Dependents', 'PhoneService', 'MultipleLines',
    'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
    'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract',
    'PaperlessBilling', 'PaymentMethod'
]

NUMERICAL_COLS = ['SeniorCitizen', 'tenure', 'MonthlyCharges', 'TotalCharges']

ALL_FEATURES = NUMERICAL_COLS + CATEGORICAL_COLS

DEFAULT_OFFER_COST = 200.0
DEFAULT_BUDGET = 2000.0

def classify_risk(probability: float) -> str:
    """Classifies risk level based on probability."""
    if probability < 0.30:
        return "Low"
    elif probability < 0.60:
        return "Medium"
    elif probability < 0.80:
        return "High"
    else:
        return "Critical"

def get_risk_action(risk: str) -> str:
    """Returns recommended retention action based on risk level."""
    actions = {
        "Low": "Monitor",
        "Medium": "Consider personalized engagement",
        "High": "Prioritize retention offer",
        "Critical": "Immediate retention intervention"
    }
    return actions.get(risk, "Monitor")

def calculate_retention_metrics(churn_probability: float, customer_value: float, offer_cost: float = DEFAULT_OFFER_COST) -> Dict[str, Any]:
    """Calculates expected value saved and ROI."""
    expected_value_saved = churn_probability * customer_value
    roi = ((expected_value_saved - offer_cost) / offer_cost) * 100.0 if offer_cost > 0 else 0.0
    risk = classify_risk(churn_probability)
    action = get_risk_action(risk)
    
    return {
        "churn_probability": round(churn_probability, 4),
        "churn_probability_pct": round(churn_probability * 100, 2),
        "risk": risk,
        "recommended_action": action,
        "customer_value": round(customer_value, 2),
        "offer_cost": round(offer_cost, 2),
        "expected_value_saved": round(expected_value_saved, 2),
        "roi": round(roi, 2)
    }

def build_pipeline() -> Pipeline:
    """Builds the scikit-learn ColumnTransformer and LogisticRegression pipeline."""
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', NUMERICAL_COLS),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore', sparse_output=False), CATEGORICAL_COLS)
        ]
    )
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('scaler', StandardScaler()),
        ('classifier', LogisticRegression(max_iter=1000, random_state=42))
    ])
    
    return pipeline

def load_and_preprocess_raw_data(data_path: str) -> Tuple[pd.DataFrame, pd.Series, pd.Series, pd.Series]:
    """Loads Telco Customer Churn dataset and cleans numeric columns."""
    df = pd.read_csv(data_path)
    
    customer_ids = df['customerID']
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)
    customer_values = df['TotalCharges']
    
    y = df['Churn'].map({'Yes': 1, 'No': 0})
    X = df.drop(columns=['customerID', 'Churn'])
    
    return X, y, customer_ids, customer_values

def train_and_save_model(data_path: str, model_save_path: str, metrics_save_path: str = None) -> Dict[str, Any]:
    """Trains the pipeline on the dataset, evaluates it, and saves model and metadata."""
    X, y, customer_ids, customer_values = load_and_preprocess_raw_data(data_path)
    
    X_train, X_test, y_train, y_test, id_train, id_test, val_train, val_test = train_test_split(
        X, y, customer_ids, customer_values, test_size=0.2, random_state=42, stratify=y
    )
    
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
    
    metrics = {
        "model_name": "Logistic Regression",
        "dataset_name": "Telco Customer Churn",
        "total_customers": int(len(X)),
        "train_customers": int(len(X_train)),
        "test_customers": int(len(X_test)),
        "feature_count": int(X.shape[1]),
        "features": list(X.columns),
        "accuracy": float(round(acc, 4)),
        "precision": float(round(precision, 4)),
        "recall": float(round(recall, 4)),
        "f1_score": float(round(f1, 4)),
        "confusion_matrix": {
            "tn": int(cm[0, 0]),
            "fp": int(cm[0, 1]),
            "fn": int(cm[1, 0]),
            "tp": int(cm[1, 1]),
            "matrix": cm.tolist()
        }
    }
    
    # Save pipeline and artifacts
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    bundle = {
        "pipeline": pipeline,
        "metrics": metrics,
        "feature_names": list(X.columns),
        "categorical_cols": CATEGORICAL_COLS,
        "numerical_cols": NUMERICAL_COLS
    }
    joblib.dump(bundle, model_save_path)
    
    return bundle

def load_model_bundle(model_path: str) -> Dict[str, Any]:
    """Loads the serialized model bundle."""
    return joblib.load(model_path)

def predict_customer(bundle: Dict[str, Any], customer_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Runs prediction on a single customer dictionary and returns full retention analytics."""
    pipeline = bundle["pipeline"]
    
    # Ensure types
    clean_dict = dict(customer_dict)
    clean_dict["SeniorCitizen"] = int(clean_dict.get("SeniorCitizen", 0))
    clean_dict["tenure"] = int(clean_dict.get("tenure", 0))
    clean_dict["MonthlyCharges"] = float(clean_dict.get("MonthlyCharges", 0.0))
    clean_dict["TotalCharges"] = float(clean_dict.get("TotalCharges", 0.0))
    
    input_df = pd.DataFrame([clean_dict])
    
    prob = float(pipeline.predict_proba(input_df)[0, 1])
    pred = int(pipeline.predict(input_df)[0])
    
    customer_val = clean_dict["TotalCharges"]
    offer_cost = float(customer_dict.get("offer_cost", DEFAULT_OFFER_COST))
    
    retention_info = calculate_retention_metrics(prob, customer_val, offer_cost)
    
    # Rule-based explainability factors
    risk_factors = []
    protective_factors = []
    
    if clean_dict.get("Contract") == "Month-to-month":
        risk_factors.append("Month-to-month contract (higher churn flexibility)")
    elif clean_dict.get("Contract") in ["One year", "Two year"]:
        protective_factors.append(f"{clean_dict.get('Contract')} contract commitments reduce churn risk")
        
    if clean_dict.get("tenure", 0) <= 12:
        risk_factors.append(f"Short tenure ({clean_dict.get('tenure')} months) - high early lifecycle vulnerability")
    elif clean_dict.get("tenure", 0) >= 36:
        protective_factors.append(f"Established customer loyalty ({clean_dict.get('tenure')} months tenure)")
        
    if clean_dict.get("InternetService") == "Fiber optic":
        risk_factors.append("Fiber optic internet with high price sensitivity")
    elif clean_dict.get("InternetService") == "No":
        protective_factors.append("Basic telephone-only customer profile (historically low churn)")
        
    if clean_dict.get("PaymentMethod") == "Electronic check":
        risk_factors.append("Electronic check payment (highest churn payment channel)")
    elif "automatic" in clean_dict.get("PaymentMethod", "").lower():
        protective_factors.append("Automated payment method setup")
        
    if clean_dict.get("OnlineSecurity") == "No":
        risk_factors.append("Lack of online security add-on")
    if clean_dict.get("TechSupport") == "No":
        risk_factors.append("Lack of tech support services")
    if clean_dict.get("MonthlyCharges", 0) > 75:
        risk_factors.append(f"High monthly bill (₹{clean_dict.get('MonthlyCharges'):.2f})")
        
    return {
        "predicted_churn": pred,
        "churn_label": "Yes" if pred == 1 else "No",
        **retention_info,
        "risk_factors": risk_factors,
        "protective_factors": protective_factors
    }

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "backend", "data", "Telco-Customer-Churn.csv")
    model_path = os.path.join(base_dir, "backend", "models", "churn_model.pkl")
    
    print("Training model and pipeline...")
    result = train_and_save_model(data_path, model_path)
    print("Metrics:")
    for k, v in result["metrics"].items():
        if k != "confusion_matrix":
            print(f"  {k}: {v}")
    print("Confusion Matrix:\n", np.array(result["metrics"]["confusion_matrix"]["matrix"]))
