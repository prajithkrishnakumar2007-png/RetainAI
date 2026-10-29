from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CustomerPredictionRequest(BaseModel):
    gender: str = Field(default="Female", description="Gender: Female, Male")
    SeniorCitizen: int = Field(default=0, description="0 for No, 1 for Yes")
    Partner: str = Field(default="No", description="Yes, No")
    Dependents: str = Field(default="No", description="Yes, No")
    tenure: int = Field(default=1, ge=0, le=100, description="Tenure in months")
    PhoneService: str = Field(default="Yes", description="Yes, No")
    MultipleLines: str = Field(default="No", description="No, Yes, No phone service")
    InternetService: str = Field(default="Fiber optic", description="DSL, Fiber optic, No")
    OnlineSecurity: str = Field(default="No", description="No, Yes, No internet service")
    OnlineBackup: str = Field(default="No", description="No, Yes, No internet service")
    DeviceProtection: str = Field(default="No", description="No, Yes, No internet service")
    TechSupport: str = Field(default="No", description="No, Yes, No internet service")
    StreamingTV: str = Field(default="No", description="No, Yes, No internet service")
    StreamingMovies: str = Field(default="No", description="No, Yes, No internet service")
    Contract: str = Field(default="Month-to-month", description="Month-to-month, One year, Two year")
    PaperlessBilling: str = Field(default="Yes", description="Yes, No")
    PaymentMethod: str = Field(default="Electronic check", description="Electronic check, Mailed check, Bank transfer (automatic), Credit card (automatic)")
    MonthlyCharges: float = Field(default=70.35, ge=0.0, description="Monthly fee in currency")
    TotalCharges: float = Field(default=70.35, ge=0.0, description="Total accumulated charges")
    offer_cost: Optional[float] = Field(default=200.0, description="Cost of retention offer")

class CustomerPredictionResponse(BaseModel):
    predicted_churn: int
    churn_label: str
    churn_probability: float
    churn_probability_pct: float
    risk: str
    recommended_action: str
    customer_value: float
    offer_cost: float
    expected_value_saved: float
    roi: float
    risk_factors: List[str]
    protective_factors: List[str]

class BudgetOptimizationRequest(BaseModel):
    budget: float = Field(default=2000.0, ge=0.0, description="Retention campaign budget")
    offer_cost: float = Field(default=200.0, gt=0.0, description="Cost per retention offer")

class BudgetOptimizationResponse(BaseModel):
    budget: float
    offer_cost: float
    max_customers: int
    selected_count: int
    total_spending: float
    total_expected_value_saved: float
    expected_net_value: float
    overall_roi: float
    selected_customers: List[Dict[str, Any]]
