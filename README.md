# RetainAI 🚀
### AI-Powered Customer Retention & ROI Value Optimization Engine

[![GitHub Repository](https://img.shields.io/badge/GitHub-RetainAI-181717?style=for-the-badge&logo=github)](https://github.com/prajithkrishnakumar2007-png/RetainAI)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

---

## 📌 Executive Summary

**RetainAI** is a full-stack machine learning web application that transforms standard Telco Customer Churn predictive modeling from a passive classification exercise into an **actionable, value-maximizing retention engine**.

Traditional churn models only predict *who* will churn. RetainAI answers the critical business questions:
1. **Who is actually worth saving?** (Financial impact & Expected Value Saved)
2. **What offer maximizes net ROI under a finite marketing budget?** (Constrained Knapsack Optimization)
3. **What specific factors are driving each customer's departure?** (Explainable AI & Risk Attribution)

---

## 🌟 Key Features & Capabilities

- 🤖 **Production Machine Learning Pipeline**:
  - Preprocessing with Scikit-learn `ColumnTransformer`, `OneHotEncoder(handle_unknown='ignore')`, and `StandardScaler`.
  - Tuned `LogisticRegression(max_iter=1000)` achieving **80.70% Accuracy** on a stratified 20% test split.
  - Fully serialized pipeline (`churn_model.pkl`) with persistent calibration metrics.

- 💰 **Financial Retention Economics**:
  - **Customer Value Proxy**: Estimated through `TotalCharges` (with clear transparent modeling assumptions).
  - **Expected Value Saved**: $\text{Churn Probability} \times \text{Customer Value}$.
  - **Retention Offer ROI**: $\frac{\text{Expected Value Saved} - \text{Offer Cost}}{\text{Offer Cost}} \times 100$.

- 🎯 **Constrained Budget Optimizer**:
  - Allocates customizable marketing budgets (default ₹2,000 at ₹200/offer) using priority ROI ranking.
  - Value-First Targeting avoids squandering budget on low-value customers with negative net return.

- 🔮 **Interactive Predictive Studio**:
  - Real-time customer scenario simulator with one-click presets (**"High Risk"**, **"Medium Risk"**, **"Loyal Customer"**).
  - Instant probability score, risk tier assignment, drivers, and offer recommendation.

- 📊 **Multi-Cohort Analytics & Visualizations**:
  - Dynamic Recharts analytics analyzing churn distribution across Contract types, Internet Services, Payment Methods, Tenure Cohorts, and Monthly Charges.
  - Interactive 2D scatter matrix mapping customer value against churn probability.

- 🛡️ **Model Transparency & Fair Explainability**:
  - Complete confusion matrix breakdown ($TN=925$, $FP=110$, $FN=162$, $TP=212$).
  - Built-in business rationale detailing why raw accuracy is insufficient in imbalanced retention settings.

---

## 📁 Repository Structure

```
RetainAI/
├── backend/
│   ├── data/
│   │   └── Telco-Customer-Churn.csv   # Source dataset (7,043 customer accounts)
│   ├── database/
│   │   └── churn.db                   # SQLite database (precomputed scores & metadata)
│   ├── models/
│   │   └── churn_model.pkl            # Serialized ML pipeline + evaluation metrics
│   ├── __init__.py
│   ├── main.py                        # FastAPI REST API & lifespan loader
│   ├── model.py                       # ML pipeline, training & inference logic
│   ├── database.py                    # Database schema, queries & knapsack optimizer
│   ├── schemas.py                     # Pydantic v2 request & response models
│   └── requirements.txt               # Backend Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/                # Modular UI (Sidebar, Header, KPICard, RiskBadge, ROIBadge)
│   │   ├── pages/                     # Dashboard, Customers, CustomerDetail, Optimizer, Predict, Analytics, ModelInfo
│   │   ├── services/api.js            # Axios client connected to FastAPI backend
│   │   ├── App.jsx                    # Client-side routing
│   │   ├── index.css                  # Tailored dark-mode SaaS design system
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js                 # Vite dev server with proxy to backend
│   └── tailwind.config.js             # Custom theme colors and gradients
│
├── churn.py                           # Untouched benchmark reference implementation
├── Telco-Customer-Churn.csv           # Master dataset reference
├── .gitignore                         # Configured ignore patterns
└── README.md                          # Project documentation
```

---

## 🧠 Model Performance & Benchmarks

| Metric | Score | Details / Evaluation Criteria |
|---|---|---|
| **Accuracy** | **80.70%** | Evaluated on stratified 20% test split (1,409 customers) |
| **Precision (Churn=1)** | **65.84%** | Accuracy of positive churn predictions |
| **Recall (Churn=1)** | **56.68%** | Ratio of actual churners flagged |
| **F1 Score** | **60.92%** | Balanced harmonic mean |
| **True Negatives (TN)** | **925** | Correctly predicted retained customers |
| **False Positives (FP)** | **110** | Unnecessary retention offers proposed |
| **False Negatives (FN)** | **162** | Departed unnoticed |
| **True Positives (TP)** | **212** | Correctly intercepted churners |

> **Business Context:** In telecommunications, ~73% of customers do not churn. A naive model that blindly predicts "No Churn" yields 73% accuracy while capturing 0 departing revenue. RetainAI optimizes for Expected Net ROI to protect high-impact recurring revenue.

---

## 🚦 Risk Classification Tiers

| Risk Level | Probability Threshold | Action Recommendation | Strategy |
|---|---|---|---|
| 🟢 **Low Risk** | $P < 0.30$ | Monitor | Standard engagement; no intervention required |
| 🟡 **Medium Risk** | $0.30 \le P < 0.60$ | Personalized Engagement | Feature updates, loyalty rewards, proactive check-ins |
| 🟠 **High Risk** | $0.60 \le P < 0.80$ | Prioritize Retention Offer | Tailored contract incentives, discount vouchers |
| 🔴 **Critical Risk** | $P \ge 0.80$ | Immediate Intervention | Urgent outreach, executive retention call, custom package |

---

## 🔌 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health verification and ML model in-memory status check |
| `GET` | `/api/dashboard` | Aggregated executive KPIs, risk counts, churn rate, and portfolio ROI |
| `GET` | `/api/customers` | Paginated customer table with search, risk filters, and sorting |
| `GET` | `/api/customers/{id}` | Detailed customer telemetry, risk breakdown, and churn drivers |
| `POST` | `/api/predict` | Real-time churn probability, risk tier, value saved, and ROI calculation |
| `POST` | `/api/budget` | Constrained budget allocation allocating offers to highest net-return targets |
| `GET` | `/api/analytics` | Cohort distributions, categorical churn rates, and 2D value map |
| `GET` | `/api/model-metrics` | Performance metrics, confusion matrix, and transparency assumptions |

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

---

### Step 1: Backend Setup (FastAPI)

```bash
# Navigate to repository root
cd "Hackathon kpr"

# (Optional) Create & activate a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The interactive OpenAPI Swagger documentation will be available at:  
👉 **`http://127.0.0.1:8000/docs`**

---

### Step 2: Frontend Setup (React + Vite)

Open a new terminal window:

```bash
# Navigate to the frontend directory
cd "frontend"

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```

Open your browser at:  
👉 **`http://localhost:5173`**

---

## 🛠️ Tech Stack Details

- **Backend**: FastAPI, Uvicorn, SQLite3, Pydantic v2
- **Data & ML**: Scikit-Learn, Pandas, NumPy, Joblib
- **Frontend**: React 19, Vite, TailwindCSS, Recharts, Lucide Icons, Axios, React Router v7
- **Design Architecture**: Modern responsive dark SaaS theme with glassmorphism effects and micro-interactions

---

## 📄 License & Attribution

Developed for Hackathon KPR. Distributed under the MIT License.  
Author: [prajithkrishnakumar2007-png](https://github.com/prajithkrishnakumar2007-png)
