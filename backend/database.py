import os
import sqlite3
import pandas as pd
from typing import Dict, Any, List, Optional
import json

from backend.model import (
    load_model_bundle,
    classify_risk,
    get_risk_action,
    DEFAULT_OFFER_COST,
    DEFAULT_BUDGET
)

DB_PATH = os.path.join(os.path.dirname(__file__), "database", "churn.db")
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "Telco-Customer-Churn.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "churn_model.pkl")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force: bool = False):
    """Initializes and seeds SQLite database from the dataset and ML model."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = get_db()
    cursor = conn.cursor()
    
    if force:
        cursor.execute("DROP TABLE IF EXISTS customers")
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            customer_id TEXT PRIMARY KEY,
            gender TEXT,
            senior_citizen INTEGER,
            partner TEXT,
            dependents TEXT,
            tenure INTEGER,
            phone_service TEXT,
            multiple_lines TEXT,
            internet_service TEXT,
            online_security TEXT,
            online_backup TEXT,
            device_protection TEXT,
            tech_support TEXT,
            streaming_tv TEXT,
            streaming_movies TEXT,
            contract TEXT,
            paperless_billing TEXT,
            payment_method TEXT,
            monthly_charges REAL,
            total_charges REAL,
            actual_churn TEXT,
            churn_probability REAL,
            predicted_churn INTEGER,
            risk TEXT,
            recommended_action TEXT,
            customer_value REAL,
            offer_cost REAL,
            expected_value_saved REAL,
            roi REAL
        )
    """)
    conn.commit()
    
    # Check count
    cursor.execute("SELECT COUNT(*) FROM customers")
    count = cursor.fetchone()[0]
    
    if count == 0 and os.path.exists(DATA_PATH) and os.path.exists(MODEL_PATH):
        print("Populating SQLite database with Telco dataset predictions...")
        bundle = load_model_bundle(MODEL_PATH)
        pipeline = bundle["pipeline"]
        
        df = pd.read_csv(DATA_PATH)
        df_clean = df.copy()
        df_clean['TotalCharges'] = pd.to_numeric(df_clean['TotalCharges'].astype(str).str.strip(), errors='coerce').fillna(0.0)
        
        feature_df = df_clean.drop(columns=['customerID', 'Churn'])
        
        probs = pipeline.predict_proba(feature_df)[:, 1]
        preds = pipeline.predict(feature_df)
        
        rows_to_insert = []
        for idx, row in df_clean.iterrows():
            cid = row['customerID']
            prob = float(probs[idx])
            pred = int(preds[idx])
            c_val = float(row['TotalCharges'])
            risk = classify_risk(prob)
            action = get_risk_action(risk)
            offer_cost = DEFAULT_OFFER_COST
            val_saved = prob * c_val
            roi = ((val_saved - offer_cost) / offer_cost) * 100.0 if offer_cost > 0 else 0.0
            
            rows_to_insert.append((
                cid,
                str(row['gender']),
                int(row['SeniorCitizen']),
                str(row['Partner']),
                str(row['Dependents']),
                int(row['tenure']),
                str(row['PhoneService']),
                str(row['MultipleLines']),
                str(row['InternetService']),
                str(row['OnlineSecurity']),
                str(row['OnlineBackup']),
                str(row['DeviceProtection']),
                str(row['TechSupport']),
                str(row['StreamingTV']),
                str(row['StreamingMovies']),
                str(row['Contract']),
                str(row['PaperlessBilling']),
                str(row['PaymentMethod']),
                float(row['MonthlyCharges']),
                float(row['TotalCharges']),
                str(row['Churn']),
                round(prob, 4),
                pred,
                risk,
                action,
                round(c_val, 2),
                round(offer_cost, 2),
                round(val_saved, 2),
                round(roi, 2)
            ))
            
        cursor.executemany("""
            INSERT INTO customers VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        """, rows_to_insert)
        conn.commit()
        print(f"Successfully loaded {len(rows_to_insert)} customers into churn.db")
        
    conn.close()

def get_customers(
    search: Optional[str] = None,
    risk: Optional[str] = None,
    min_churn_probability: Optional[float] = None,
    max_churn_probability: Optional[float] = None,
    sort_by: str = "roi",
    sort_order: str = "desc",
    limit: int = 50,
    offset: int = 0
) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    conditions = []
    params = []
    
    if search:
        conditions.append("(customer_id LIKE ? OR payment_method LIKE ? OR contract LIKE ?)")
        term = f"%{search.strip()}%"
        params.extend([term, term, term])
        
    if risk and risk != "All":
        conditions.append("risk = ?")
        params.append(risk)
        
    if min_churn_probability is not None:
        conditions.append("churn_probability >= ?")
        params.append(min_churn_probability)
        
    if max_churn_probability is not None:
        conditions.append("churn_probability <= ?")
        params.append(max_churn_probability)
        
    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    
    # Allowed sort columns
    allowed_sorts = {
        "customer_id": "customer_id",
        "churn_probability": "churn_probability",
        "risk": "churn_probability",
        "customer_value": "customer_value",
        "expected_value_saved": "expected_value_saved",
        "roi": "roi",
        "tenure": "tenure",
        "monthly_charges": "monthly_charges"
    }
    order_col = allowed_sorts.get(sort_by.lower(), "roi")
    order_dir = "ASC" if sort_order.lower() == "asc" else "DESC"
    
    count_query = f"SELECT COUNT(*) FROM customers {where_clause}"
    cursor.execute(count_query, params)
    total_count = cursor.fetchone()[0]
    
    query = f"""
        SELECT * FROM customers
        {where_clause}
        ORDER BY {order_col} {order_dir}
        LIMIT ? OFFSET ?
    """
    params.extend([limit, offset])
    cursor.execute(query, params)
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return {
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "customers": rows
    }

def get_customer_by_id(customer_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE customer_id = ?", (customer_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    
    data = dict(row)
    # Generate explainability factors
    risk_factors = []
    protective_factors = []
    
    if data.get("contract") == "Month-to-month":
        risk_factors.append("Month-to-month contract offers highest flexibility to churn")
    elif data.get("contract") in ["One year", "Two year"]:
        protective_factors.append(f"{data.get('contract')} agreement locks in retention")
        
    if data.get("tenure", 0) <= 12:
        risk_factors.append(f"Short tenure ({data.get('tenure')} months) - early lifecycle vulnerability")
    elif data.get("tenure", 0) >= 36:
        protective_factors.append(f"Long-term customer ({data.get('tenure')} months tenure)")
        
    if data.get("internet_service") == "Fiber optic":
        risk_factors.append("Fiber optic subscription with elevated pricing sensitivity")
        
    if data.get("payment_method") == "Electronic check":
        risk_factors.append("Electronic check payment method has historically highest churn rate")
        
    if data.get("online_security") == "No":
        risk_factors.append("No active Online Security add-on")
    if data.get("tech_support") == "No":
        risk_factors.append("No Tech Support subscription")
    if data.get("monthly_charges", 0) > 70:
        risk_factors.append(f"High monthly recurring charge (₹{data.get('monthly_charges'):.2f})")
        
    data["risk_factors"] = risk_factors
    data["protective_factors"] = protective_factors
    return data

def get_dashboard_metrics() -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM customers")
    total_customers = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM customers WHERE actual_churn = 'Yes'")
    actual_churners = cursor.fetchone()[0]
    churn_rate = round((actual_churners / total_customers) * 100, 2) if total_customers > 0 else 0.0
    
    cursor.execute("SELECT COUNT(*) FROM customers WHERE risk = 'High'")
    high_risk_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM customers WHERE risk = 'Critical'")
    critical_risk_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT SUM(expected_value_saved), AVG(roi), SUM(customer_value) FROM customers")
    sum_val_saved, avg_roi, sum_cust_val = cursor.fetchone()
    
    # Risk distribution
    cursor.execute("SELECT risk, COUNT(*) as count FROM customers GROUP BY risk")
    risk_dist = [dict(r) for r in cursor.fetchall()]
    
    # Churn distribution
    cursor.execute("SELECT actual_churn, COUNT(*) as count FROM customers GROUP BY actual_churn")
    churn_dist = [dict(r) for r in cursor.fetchall()]
    
    # Contract vs Churn
    cursor.execute("""
        SELECT contract, 
               COUNT(*) as total, 
               SUM(CASE WHEN actual_churn='Yes' THEN 1 ELSE 0 END) as churned,
               AVG(churn_probability) as avg_churn_prob
        FROM customers GROUP BY contract
    """)
    contract_stats = [dict(r) for r in cursor.fetchall()]
    
    # ROI Distribution buckets
    cursor.execute("""
        SELECT 
            CASE 
                WHEN roi < 0 THEN 'Negative ROI (< 0%)'
                WHEN roi >= 0 AND roi < 100 THEN 'Low ROI (0% - 100%)'
                WHEN roi >= 100 AND roi < 500 THEN 'Medium ROI (100% - 500%)'
                WHEN roi >= 500 AND roi < 1000 THEN 'High ROI (500% - 1000%)'
                ELSE 'Exceptional ROI (>= 1000%)'
            END as roi_bucket,
            COUNT(*) as count
        FROM customers
        GROUP BY roi_bucket
    """)
    roi_dist = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_customers": total_customers,
        "churn_rate": churn_rate,
        "high_risk_customers": high_risk_count,
        "critical_risk_customers": critical_risk_count,
        "total_expected_value_saved": round(sum_val_saved or 0, 2),
        "average_roi": round(avg_roi or 0, 2),
        "total_customer_value": round(sum_cust_val or 0, 2),
        "default_budget": DEFAULT_BUDGET,
        "risk_distribution": risk_dist,
        "churn_distribution": churn_dist,
        "contract_stats": contract_stats,
        "roi_distribution": roi_dist
    }

def get_analytics_breakdown() -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    def fetch_group(column):
        cursor.execute(f"""
            SELECT {column} as category,
                   COUNT(*) as total,
                   SUM(CASE WHEN actual_churn='Yes' THEN 1 ELSE 0 END) as churned,
                   ROUND(AVG(churn_probability) * 100, 2) as avg_churn_prob_pct,
                   ROUND(AVG(customer_value), 2) as avg_value
            FROM customers
            GROUP BY {column}
        """)
        return [dict(r) for r in cursor.fetchall()]
        
    contract_data = fetch_group("contract")
    internet_data = fetch_group("internet_service")
    payment_data = fetch_group("payment_method")
    
    # Tenure buckets
    cursor.execute("""
        SELECT 
            CASE 
                WHEN tenure <= 12 THEN '0 - 12 Months'
                WHEN tenure <= 24 THEN '13 - 24 Months'
                WHEN tenure <= 48 THEN '25 - 48 Months'
                ELSE '49+ Months'
            END as tenure_group,
            COUNT(*) as total,
            SUM(CASE WHEN actual_churn='Yes' THEN 1 ELSE 0 END) as churned,
            ROUND(AVG(churn_probability) * 100, 2) as avg_churn_prob_pct
        FROM customers
        GROUP BY tenure_group
        ORDER BY MIN(tenure)
    """)
    tenure_data = [dict(r) for r in cursor.fetchall()]
    
    # Monthly Charges buckets
    cursor.execute("""
        SELECT 
            CASE 
                WHEN monthly_charges < 35 THEN 'Under ₹35'
                WHEN monthly_charges < 70 THEN '₹35 - ₹70'
                WHEN monthly_charges < 95 THEN '₹70 - ₹95'
                ELSE '₹95+'
            END as charge_group,
            COUNT(*) as total,
            SUM(CASE WHEN actual_churn='Yes' THEN 1 ELSE 0 END) as churned,
            ROUND(AVG(churn_probability) * 100, 2) as avg_churn_prob_pct
        FROM customers
        GROUP BY charge_group
    """)
    charges_data = [dict(r) for r in cursor.fetchall()]
    
    # Scatter sample: Customer Value vs Churn Probability (sample 150 points for fast chart rendering)
    cursor.execute("""
        SELECT customer_id, customer_value, churn_probability, risk, roi
        FROM customers
        ORDER BY RANDOM()
        LIMIT 150
    """)
    scatter_sample = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    
    return {
        "churn_by_contract": contract_data,
        "churn_by_internet_service": internet_data,
        "churn_by_payment_method": payment_data,
        "churn_by_tenure": tenure_data,
        "churn_by_monthly_charges": charges_data,
        "value_vs_probability_sample": scatter_sample
    }

def run_retention_optimizer(budget: float, offer_cost: float) -> Dict[str, Any]:
    """Optimizes customer selection based on expected business value / ROI under budget constraint."""
    if budget <= 0 or offer_cost <= 0:
        return {
            "budget": budget,
            "offer_cost": offer_cost,
            "max_customers": 0,
            "selected_count": 0,
            "total_spending": 0.0,
            "total_expected_value_saved": 0.0,
            "expected_net_value": 0.0,
            "overall_roi": 0.0,
            "selected_customers": []
        }
        
    max_customers = int(budget // offer_cost)
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Dynamically compute ROI based on user-provided offer_cost
    cursor.execute(f"""
        SELECT customer_id, churn_probability, risk, customer_value,
               ROUND(churn_probability * customer_value, 2) as dynamic_val_saved,
               ROUND(((churn_probability * customer_value - ?) / ?) * 100, 2) as dynamic_roi,
               contract, tenure, monthly_charges, payment_method
        FROM customers
        WHERE churn_probability * customer_value > ?
        ORDER BY dynamic_roi DESC
        LIMIT ?
    """, (offer_cost, offer_cost, offer_cost, max_customers))
    
    selected_rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    
    # If not enough with positive ROI, pick highest expected value saved
    if len(selected_rows) < max_customers:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT customer_id, churn_probability, risk, customer_value,
                   ROUND(churn_probability * customer_value, 2) as dynamic_val_saved,
                   ROUND(((churn_probability * customer_value - ?) / ?) * 100, 2) as dynamic_roi,
                   contract, tenure, monthly_charges, payment_method
            FROM customers
            ORDER BY dynamic_val_saved DESC
            LIMIT ?
        """, (offer_cost, offer_cost, max_customers))
        selected_rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        
    for r in selected_rows:
        r["offer_cost"] = offer_cost
        r["selection_reason"] = (
            f"High Expected Return: saves ₹{r['dynamic_val_saved']:.2f} for ₹{offer_cost:.2f} spend "
            f"(ROI: {r['dynamic_roi']:.1f}%). Churn Risk is {r['risk']} ({r['churn_probability']*100:.1f}%)."
        )
        
    total_spending = len(selected_rows) * offer_cost
    total_expected_value = sum(r['dynamic_val_saved'] for r in selected_rows)
    expected_net_value = total_expected_value - total_spending
    overall_roi = ((total_expected_value - total_spending) / total_spending * 100.0) if total_spending > 0 else 0.0
    
    return {
        "budget": budget,
        "offer_cost": offer_cost,
        "max_customers": max_customers,
        "selected_count": len(selected_rows),
        "total_spending": round(total_spending, 2),
        "total_expected_value_saved": round(total_expected_value, 2),
        "expected_net_value": round(expected_net_value, 2),
        "overall_roi": round(overall_roi, 2),
        "selected_customers": selected_rows
    }
