import os
import sys
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.model import (
    load_model_bundle,
    predict_customer,
    DEFAULT_OFFER_COST,
    DEFAULT_BUDGET
)
from backend.database import (
    init_db,
    get_customers,
    get_customer_by_id,
    get_dashboard_metrics,
    get_analytics_breakdown,
    run_retention_optimizer
)
from backend.schemas import (
    CustomerPredictionRequest,
    CustomerPredictionResponse,
    BudgetOptimizationRequest,
    BudgetOptimizationResponse
)

MODEL_BUNDLE = None

def get_bundle():
    global MODEL_BUNDLE
    if MODEL_BUNDLE is None:
        model_file = os.path.join(os.path.dirname(__file__), "models", "churn_model.pkl")
        if os.path.exists(model_file):
            MODEL_BUNDLE = load_model_bundle(model_file)
            print("Loaded churn_model.pkl bundle into memory.")
    return MODEL_BUNDLE

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up RetainAI backend...")
    init_db(force=False)
    get_bundle()
    yield
    print("Shutting down RetainAI backend...")

app = FastAPI(
    title="RetainAI API",
    description="AI-Powered Customer Retention & Churn Optimization Engine",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["System"])
def health_check():
    bundle = get_bundle()
    return {
        "status": "healthy",
        "service": "RetainAI Backend",
        "version": "1.0.0",
        "model_loaded": bundle is not None
    }

@app.get("/api/dashboard", tags=["Dashboard"])
def get_dashboard():
    try:
        metrics = get_dashboard_metrics()
        bundle = get_bundle()
        accuracy = 0.8070
        if bundle and "metrics" in bundle:
            accuracy = bundle["metrics"].get("accuracy", 0.8070)
        metrics["model_accuracy"] = accuracy
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/customers", tags=["Customers"])
def list_customers(
    search: Optional[str] = Query(None, description="Search by Customer ID, Contract, or Payment Method"),
    risk: Optional[str] = Query(None, description="Filter by Risk: Low, Medium, High, Critical"),
    min_churn_probability: Optional[float] = Query(None, ge=0.0, le=1.0, description="Minimum churn probability"),
    max_churn_probability: Optional[float] = Query(None, ge=0.0, le=1.0, description="Maximum churn probability"),
    sort_by: str = Query("roi", description="Sort by field: roi, churn_probability, customer_value, expected_value_saved, tenure, monthly_charges"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    limit: int = Query(50, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    try:
        return get_customers(
            search=search,
            risk=risk,
            min_churn_probability=min_churn_probability,
            max_churn_probability=max_churn_probability,
            sort_by=sort_by,
            sort_order=sort_order,
            limit=limit,
            offset=offset
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/customers/{customer_id}", tags=["Customers"])
def get_customer_details(customer_id: str):
    customer = get_customer_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer '{customer_id}' not found.")
    return customer

@app.post("/api/predict", response_model=CustomerPredictionResponse, tags=["Prediction"])
def predict_churn(customer_data: CustomerPredictionRequest):
    bundle = get_bundle()
    if not bundle:
        raise HTTPException(status_code=503, detail="ML model is not loaded.")
    try:
        data_dict = customer_data.model_dump()
        result = predict_customer(bundle, data_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/api/budget", response_model=BudgetOptimizationResponse, tags=["Optimization"])
def optimize_retention_budget(payload: BudgetOptimizationRequest):
    try:
        return run_retention_optimizer(payload.budget, payload.offer_cost)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics", tags=["Analytics"])
def get_analytics():
    try:
        return get_analytics_breakdown()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model-metrics", tags=["Model"])
def get_model_information():
    bundle = get_bundle()
    if not bundle or "metrics" not in bundle:
        raise HTTPException(status_code=503, detail="Model bundle not loaded.")
    
    metrics = bundle["metrics"]
    
    assumptions = [
        "TotalCharges is used as a prototype customer-value proxy.",
        "TotalCharges is not actual profit or true Customer Lifetime Value (CLV).",
        "Default retention offer cost is ₹200.",
        "Risk thresholds are prototype thresholds: Low (<30%), Medium (30-60%), High (60-80%), Critical (>=80%).",
        "ROI is calculated using expected value saved: ((Expected Value Saved - Offer Cost) / Offer Cost) * 100.",
        "Predictions are probabilistic estimations and are not guarantees of future customer behavior.",
        "Retention recommendations (Monitor, Personalized Engagement, Offer, Intervention) are business heuristics for the prototype.",
        "Model performance should be evaluated across multiple metrics (Precision, Recall, F1-Score, Confusion Matrix), not accuracy alone."
    ]
    
    limitations = [
        "Dataset represents historical snapshot behavior from a single telecommunications provider.",
        "External macroeconomic factors, competitor promotional campaigns, and customer support ticket interactions are not captured in this dataset.",
        "Linear decision boundary of Logistic Regression may not capture non-linear feature interactions as well as ensemble tree architectures."
    ]
    
    business_context = (
        "Accuracy alone is not sufficient for evaluating churn prediction because the business objective "
        "is to identify customers who may churn and prioritize cost-effective retention actions before they leave. "
        "High recall ensures we do not miss churners, while adequate precision prevents wasting retention budget on customers "
        "who had no intention of leaving."
    )
    
    return {
        **metrics,
        "assumptions": assumptions,
        "limitations": limitations,
        "business_context": business_context
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
