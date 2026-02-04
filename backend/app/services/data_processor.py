
import pandas as pd
import io

from typing import Dict, Any, List
from datetime import datetime

class DataProcessor:
    @staticmethod
    def process_file(file_content: bytes, filename: str) -> Dict[str, Any]:
        """
        Process the uploaded financial file (CSV/XLSX/PDF) and extract key metrics.
        """
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(file_content))
            elif filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(file_content))
            else:
                raise ValueError("Unsupported file format. Please upload CSV or XLSX")

            # Detect if it's financial or generic
            # For now, let's provide BOTH financial analysis AND generic metadata
            # if the file looks like it has finance columns
            
            financial_summary = DataProcessor._analyze_dataframe(df.copy(), filename)
            generic_metadata = DataProcessor._analyze_generic_dataset(df)
            
            # Merge or return both
            financial_summary['generic_metadata'] = generic_metadata
            return financial_summary

        except Exception as e:
            return {"error": str(e)}
    

    
    @staticmethod
    def _analyze_dataframe(df: pd.DataFrame, filename: str) -> Dict[str, Any]:
        """
        Intelligently analyze dataframe using the Smart Column Mapper pipeline.
        """
        # Step 1-5: Smart Mapping & Cleaning
        df, mapping_error = DataProcessor._smart_map_dataframe(df)
        if mapping_error:
            return {"error": mapping_error}

        summary = {
            "total_revenue": 0.0,
            "total_expenses": 0.0,
            "net_profit": 0.0,
            "row_count": len(df),
            "columns": df.columns.tolist(),
            "date_range": None,
            "categories": {},
            "monthly_breakdown": [],
            "top_expenses": [],
            "top_revenue_sources": []
        }

        # Step 6: Perform Calculations on Standardized Data
        df['is_income'] = df['type'].str.lower() == 'income'
        df['is_expense'] = df['type'].str.lower() == 'expense'

        summary['total_revenue'] = float(df[df['is_income']]['amount'].sum())
        summary['total_expenses'] = abs(float(df[df['is_expense']]['amount'].sum()))
        summary['net_profit'] = summary['total_revenue'] - summary['total_expenses']

        # Calculate sum of absolute amounts per category
        category_summary = df.assign(abs_amt=df['amount'].abs()).groupby('category')['abs_amt'].sum().to_dict()
        summary['categories'] = {str(k): float(v) for k, v in category_summary.items()}

        expense_df = df[df['is_expense']].copy()
        if not expense_df.empty:
            top_exp = expense_df.assign(abs_amt=expense_df['amount'].abs()).groupby('category')['abs_amt'].sum().nlargest(5)
            summary['top_expenses'] = [
                {"category": str(cat), "amount": float(amt)} 
                for cat, amt in top_exp.items()
            ]

        income_df = df[df['is_income']].copy()
        if not income_df.empty:
            top_rev = income_df.groupby('category')['amount'].sum().nlargest(5)
            summary['top_revenue_sources'] = [
                {"category": str(cat), "amount": float(amt)} 
                for cat, amt in top_rev.items()
            ]

        def get_sum_by_keywords(keywords):
            mask = df['category'].astype(str).str.lower().apply(
                lambda x: any(k in x for k in keywords)
            )
            return df[mask]['amount'].sum()

        summary['accounts_receivable'] = float(get_sum_by_keywords(['receivable', 'debtor', 'due from']))
        summary['accounts_payable'] = float(get_sum_by_keywords(['payable', 'creditor', 'due to']))
        summary['inventory_value'] = float(get_sum_by_keywords(['inventory', 'stock', 'raw material']))
        summary['total_debt'] = float(get_sum_by_keywords(['loan', 'liability', 'mortgage', 'debt']))
        summary['tax_metadata'] = {"estimated_tax_payable": float(df['tax'].sum())}

        try:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
            valid_dates = df['date'].dropna()
            if not valid_dates.empty:
                summary['date_range'] = {
                    "start": valid_dates.min().strftime('%Y-%m-%d'),
                    "end": valid_dates.max().strftime('%Y-%m-%d')
                }
                df['month'] = df['date'].dt.to_period('M')
                monthly = df.groupby('month')['amount'].agg(['sum', 'count']).reset_index()
                monthly['month'] = monthly['month'].astype(str)
                summary['monthly_breakdown'] = monthly.to_dict('records')
        except:
            pass

        sample_df = df.head(10).copy()
        for col in sample_df.columns:
            if pd.api.types.is_datetime64_any_dtype(sample_df[col]):
                sample_df[col] = sample_df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
            elif isinstance(sample_df[col].dtype, pd.PeriodDtype):
                sample_df[col] = sample_df[col].astype(str)
        summary['sample_transactions'] = sample_df.fillna('').to_dict(orient='records')
        
        if summary['total_revenue'] > 0:
            summary['profit_margin'] = (summary['net_profit'] / summary['total_revenue']) * 100
            summary['expense_ratio'] = (summary['total_expenses'] / summary['total_revenue']) * 100
        else:
            summary['profit_margin'] = 0
            summary['expense_ratio'] = 0
        
        return summary

    @staticmethod
    def _smart_map_dataframe(df: pd.DataFrame) -> (pd.DataFrame, str):
        """
        Implementation of the Smart Column Mapper Pipeline.
        """
        try:
            # STEP 1: NORMALIZATION
            original_columns = df.columns.tolist()
            normalized_cols = []
            for col in original_columns:
                c = str(col).lower().strip()
                c = c.replace(' ', '_').replace('$', '').replace('₹', '').replace('%', '').replace('(', '').replace(')', '')
                normalized_cols.append(c)
            df.columns = normalized_cols

            # STEP 2: COLUMN MAPPING LOGIC
            mapping_rules = {
                'amount': ["amount","total","value","price","amt","sum","debit","credit"],
                'date': ["date","txn_date","invoice_date","posting_date","transaction_date","datetime"],
                'type': ["type","dr_cr","credit_debit","income_expense","transaction_type"],
                'category': ["category","head","purpose","expense_type","expense_category"],
                'customer': ["customer","client","buyer","party","vendor","particulars","description"],
                'tax': ["gst","tax","vat","igst","cgst","sgst"]
            }

            mapped_columns = {}
            for target, keywords in mapping_rules.items():
                found = None
                for kw in keywords:
                    if kw in df.columns:
                        found = kw
                        break
                if not found:
                    for col in df.columns:
                        if any(kw in col for kw in keywords):
                            found = col
                            break
                if found:
                    mapped_columns[target] = found

            # STEP 3: CLEANING
            if 'amount' not in mapped_columns:
                return None, "Error: 'Amount' column not detected. Please ensure your file has an amount field."

            amt_col = mapped_columns['amount']
            df[amt_col] = df[amt_col].astype(str).str.replace(r'[$,₹]', '', regex=True)
            df[amt_col] = pd.to_numeric(df[amt_col], errors='coerce')
            df = df.dropna(subset=[amt_col])
            
            if 'type' in mapped_columns:
                type_col = mapped_columns['type']
                income_keywords = ['income', 'revenue', 'credit', 'receipt', 'sale', 'sales']
                df['standard_type'] = df[type_col].astype(str).str.lower().apply(
                    lambda x: 'income' if any(k in x for k in income_keywords) else 'expense'
                )
            else:
                df['standard_type'] = df[amt_col].apply(lambda x: 'income' if x > 0 else 'expense')

            # STEP 4: SELECTION
            final_df = pd.DataFrame()
            final_df['amount'] = df[amt_col]
            final_df['type'] = df['standard_type']
            final_df['date'] = df[mapped_columns['date']] if 'date' in mapped_columns else datetime.now().strftime('%Y-%m-%d')
            final_df['category'] = df[mapped_columns['category']] if 'category' in mapped_columns else 'General'
            final_df['customer'] = df[mapped_columns['customer']] if 'customer' in mapped_columns else 'Unknown'
            final_df['tax'] = pd.to_numeric(df[mapped_columns['tax']], errors='coerce').fillna(0) if 'tax' in mapped_columns else 0.0

            # STEP 5: VALIDATION
            if final_df.empty:
                return None, "Error: No valid financial data found."
            if not (final_df['type'] == 'income').any() or not (final_df['type'] == 'expense').any():
                return None, "Error: File must contain both Income and Expense transactions."

            return final_df, None
        except Exception as e:
            return None, f"Mapping Error: {str(e)}"

    @staticmethod
    def _analyze_generic_dataset(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Extract generic metadata from any dataframe for Visualytics dashboard.
        """
        cols = df.columns.tolist()
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        text_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        date_cols = df.select_dtypes(include=['datetime', 'datetimetz']).columns.tolist()
        
        # Also check if text columns could be dates
        potential_dates = []
        for col in text_cols:
            try:
                # Sample 10 rows to check if it's a date
                sample = df[col].dropna().head(10)
                if not sample.empty and pd.to_datetime(sample, errors='coerce').notnull().all():
                    potential_dates.append(col)
            except:
                pass
        
        # Move potential dates from text to dates
        for col in potential_dates:
            if col in text_cols:
                text_cols.remove(col)
                date_cols.append(col)

        column_info = {
            "total_columns": len(cols),
            "numeric_count": len(numeric_cols),
            "text_count": len(text_cols),
            "date_count": len(date_cols),
            "columns": cols,
            "numeric_columns": numeric_cols,
            "text_columns": text_cols,
            "date_columns": date_cols
        }

        # Summary statistics for numeric columns
        stats = {}
        for col in numeric_cols:
            stats[col] = {
                "min": float(df[col].min()) if not df[col].empty else 0,
                "max": float(df[col].max()) if not df[col].empty else 0,
                "mean": float(df[col].mean()) if not df[col].empty else 0
            }

        # Sample data (first 100 rows for the table view)
        sample_data = df.head(100).fillna('').to_dict(orient='records')

        # Correlation matrix for numeric columns
        correlation = []
        if len(numeric_cols) > 1:
            corr_matrix = df[numeric_cols].corr().fillna(0)
            for i, row_col in enumerate(numeric_cols):
                for j, col_col in enumerate(numeric_cols):
                    correlation.append({
                        "x": row_col,
                        "y": col_col,
                        "value": float(corr_matrix.iloc[i, j])
                    })

        return {
            "column_info": column_info,
            "stats": stats,
            "sample_data": sample_data,
            "correlation": correlation
        }

    @staticmethod
    def _find_column(df: pd.DataFrame, possible_names: List[str]) -> str:
        """Helper kept for compatibility."""
        df_columns_lower = [col.lower() for col in df.columns]
        for name in possible_names:
            if name in df_columns_lower:
                return df.columns[df_columns_lower.index(name)]
        return None
