import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ==========================================
# 1. LOAD DATASET
# ==========================================

df = pd.read_csv("Telco-Customer-Churn.csv")

# Keep customer IDs
customer_ids = df["customerID"]

# ==========================================
# 2. DATA CLEANING
# ==========================================

# Convert TotalCharges to numeric
df["TotalCharges"] = pd.to_numeric(
    df["TotalCharges"].astype(str).str.strip(),
    errors="coerce"
)

# Fill missing values
df["TotalCharges"] = df["TotalCharges"].fillna(0)

# Keep TotalCharges as customer value
customer_value = df["TotalCharges"]

# Remove customer ID
df = df.drop("customerID", axis=1)

# Convert Churn to 0 and 1
df["Churn"] = df["Churn"].map({
    "Yes": 1,
    "No": 0
})

# Convert categorical columns to numbers
df = pd.get_dummies(df, drop_first=True)

# ==========================================
# 3. FEATURES AND TARGET
# ==========================================

X = df.drop("Churn", axis=1)
y = df["Churn"]

# ==========================================
# 4. TRAIN-TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test, id_train, id_test, value_train, value_test = train_test_split(
    X,
    y,
    customer_ids,
    customer_value,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================================
# 5. SCALE FEATURES
# ==========================================

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# ==========================================
# 6. CREATE AND TRAIN MODEL
# ==========================================

model = LogisticRegression(max_iter=1000)

model.fit(X_train, y_train)

# ==========================================
# 7. PREDICTIONS
# ==========================================

y_pred = model.predict(X_test)

# ==========================================
# 8. MODEL EVALUATION
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("Model Accuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ==========================================
# 9. CHURN PROBABILITY
# ==========================================

y_probability = model.predict_proba(X_test)[:, 1]

# ==========================================
# 10. CUSTOMER RESULTS
# ==========================================

results = pd.DataFrame({
    "CustomerID": id_test.values,
    "ChurnProbability": y_probability,
    "CustomerValue": value_test.values
})

# ==========================================
# 11. RISK LEVEL
# ==========================================

def risk_level(probability):

    if probability < 0.30:
        return "Low"

    elif probability < 0.60:
        return "Medium"

    elif probability < 0.80:
        return "High"

    else:
        return "Critical"


results["Risk"] = results["ChurnProbability"].apply(risk_level)

# ==========================================
# 12. RETENTION OFFER COST
# ==========================================

offer_cost = 200

results["OfferCost"] = offer_cost

# ==========================================
# 13. EXPECTED VALUE SAVED
# ==========================================

results["ExpectedValueSaved"] = (
    results["ChurnProbability"] *
    results["CustomerValue"]
)

# ==========================================
# 14. ROI
# ==========================================

results["ROI"] = (
    (results["ExpectedValueSaved"] - results["OfferCost"])
    / results["OfferCost"]
) * 100

# ==========================================
# 15. ROUND VALUES
# ==========================================

results["ChurnProbability"] = (
    results["ChurnProbability"] * 100
).round(2)

results["CustomerValue"] = results["CustomerValue"].round(2)

results["ExpectedValueSaved"] = (
    results["ExpectedValueSaved"].round(2)
)

results["ROI"] = results["ROI"].round(2)

# ==========================================
# 16. SORT BY ROI
# ==========================================

results = results.sort_values(
    by="ROI",
    ascending=False
)

# ==========================================
# 17. DISPLAY TOP ROI CUSTOMERS
# ==========================================

print("\n==========================================")
print("CUSTOMER ROI RESULTS")
print("==========================================")

print(
    results.head(10).to_string(index=False)
)

# ==========================================
# 18. BUDGET ALLOCATION
# ==========================================

budget = 2000

# Maximum number of offers
max_customers = int(budget / offer_cost)

# Select top customers
selected = results.head(max_customers).copy()

# Calculate spending
total_spending = len(selected) * offer_cost

# Calculate expected value
total_expected_value = selected[
    "ExpectedValueSaved"
].sum()

# Calculate expected net value
expected_net_value = (
    total_expected_value - total_spending
)

# ==========================================
# 19. DISPLAY BUDGET RESULTS
# ==========================================

print("\n==========================================")
print("RETENTION BUDGET ALLOCATION")
print("==========================================")

print("Total Budget: ₹", budget)
print("Offer Cost: ₹", offer_cost)
print("Customers Selected:", len(selected))
print("Total Spending: ₹", total_spending)

print(
    "Expected Value Saved: ₹",
    round(total_expected_value, 2)
)

print(
    "Expected Net Value: ₹",
    round(expected_net_value, 2)
)

print("\nSelected Customers:")

print(
    selected[
        [
            "CustomerID",
            "ChurnProbability",
            "Risk",
            "CustomerValue",
            "ExpectedValueSaved",
            "ROI"
        ]
    ].to_string(index=False)
)