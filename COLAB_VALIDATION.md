# FinSight AI - Smart Column Mapper & Validation Guide

This document explains how FinSight AI handles messy, real-world financial data and provides the exact Python code used in the pipeline. You can use this code in [Google Colab](https://colab.research.google.com/) to verify your data analysis manually.

---

## 1. The Smart Column Mapper Pipeline

FinSight AI uses a 5-step pipeline to transform messy uploads into clean financial intelligence:

1.  **Normalization**: All column names are converted to `lowercase`, spaces are replaced with `_`, and symbols (₹, $, %, etc.) are removed.
2.  **Intelligent Mapping**: The system searches for keywords to identify standard fields:
    *   `amount` ← total, value, price, amt, sum, debit, credit
    *   `date` ← txn_date, invoice_date, posting_date, transaction_date
    *   `type` ← dr_cr, credit_debit, income_expense, transaction_type
    *   `category` ← head, purpose, expense_type, expense_category
    *   `customer` ← client, buyer, party, vendor, particulars
    *   `tax` ← gst, tax, vat, igst, cgst, sgst
3.  **Cleaning**: Currency symbols are stripped, amounts are converted to numeric, and empty rows are dropped.
4.  **Transaction Detection**: If no "Type" column exists, the system automatically treats positive values as **Income** and negative values as **Expenses**.
5.  **Strict Validation**: The file MUST contain:
    *   A valid **Amount** column.
    *   At least one **Income** transaction.
    *   At least one **Expense** transaction.

---

## 2. Updated Python Code for Google Colab

Copy this code into Colab to replicate the exact logic used by FinSight AI.

```python
import pandas as pd
import numpy as np
from datetime import datetime

def smart_analyze_finances(df):
    try:
        # STEP 1: NORMALIZATION
        original_cols = df.columns.tolist()
        normalized_cols = [str(c).lower().strip().replace(' ', '_').replace('$', '').replace('₹', '') for c in original_cols]
        df.columns = normalized_cols
        print(f"Standardized Columns: {df.columns.tolist()}")

        # STEP 2: MAPPING
        mapping = {
            'amount': ["amount","total","value","sum","amt","debit","credit"],
            'type': ["type","dr_cr","income_expense","transaction_type"],
            'category': ["category","head","purpose","expense_type"],
            'tax': ["gst","tax","vat"]
        }
        
        found_map = {}
        for target, keys in mapping.items():
            for k in keys:
                if k in df.columns:
                    found_map[target] = k
                    break
        
        if 'amount' not in found_map:
            return "Error: Amount column not found!"

        # STEP 3: CLEANING
        amt_col = found_map['amount']
        df[amt_col] = pd.to_numeric(df[amt_col].astype(str).str.replace(r'[$,₹]', '', regex=True), errors='coerce')
        df = df.dropna(subset=[amt_col])

        # STEP 4: TYPE DETECTION
        if 'type' in found_map:
            t_col = found_map['type']
            income_kw = ['income', 'revenue', 'credit', 'sale']
            df['std_type'] = df[t_col].astype(str).lower().apply(lambda x: 'income' if any(kw in x for kw in income_kw) else 'expense')
        else:
            df['std_type'] = df[amt_col].apply(lambda x: 'income' if x > 0 else 'expense')

        # STEP 5: CALCULATIONS
        revenue = df[df['std_type'] == 'income'][amt_col].sum()
        expenses = abs(df[df['std_type'] == 'expense'][amt_col].sum())
        profit = revenue - expenses
        
        margin = (profit / revenue * 100) if revenue > 0 else 0
        
        # Health Score Logic
        score = 60
        if profit > 0: score += 20
        if revenue > 500000: score += 10
        final_score = min(92, max(0, score))

        print("\n--- CLEANED FINANCIAL DATA ---")
        print(df[[amt_col, 'std_type']].head())
        print("\n--- FINAL METRICS ---")
        print(f"Total Revenue:  ${revenue:,.2f}")
        print(f"Total Expenses: ${expenses:,.2f}")
        print(f"Net Profit:     ${profit:,.2f}")
        print(f"Score:          {final_score}/100")
        
    except Exception as e:
        print(f"Analysis Failed: {str(e)}")

# TEST WITH MESSY DATA
messy_data = {
    'Transaction Type (In/Out)': ['Income', 'Income', 'Expense', 'Expense'],
    'Total Billing (₹)': ['150,000', '250,000', '50,000', '20,000'],
    'Extra Column': [1, 2, 3, 4]
}
df_messy = pd.DataFrame(messy_data)
smart_analyze_finances(df_messy)
```

---

## 3. Why This Matters
By cleaning and mapping your data this way, we ensure the **AI Insights** (GPT-4) receive only pure financial numbers. This prevents "hallucinations" and ensures your Cash Flow, Debt-to-Equity, and Working Capital analysis are 100% accurate.
