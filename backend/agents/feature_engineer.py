import pandas as pd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures, KBinsDiscretizer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.impute import SimpleImputer
import logging

class FeatureEngineeringAgent:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def _impute_missing(self, df: pd.DataFrame, target_col: str) -> pd.DataFrame:
        df = df.copy()
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

        if target_col in num_cols:
            num_cols.remove(target_col)
        if target_col in cat_cols:
            cat_cols.remove(target_col)

        if num_cols:
            imputer = SimpleImputer(strategy='mean')
            df[num_cols] = imputer.fit_transform(df[num_cols])
        
        if cat_cols:
            imputer = SimpleImputer(strategy='most_frequent')
            df[cat_cols] = imputer.fit_transform(df[cat_cols])
            
        return df

    def execute(self, df: pd.DataFrame, target_col: str) -> dict:
        """
        Executes feature engineering on the given dataframe.
        """
        if target_col not in df.columns:
            raise ValueError(f"Target column '{target_col}' not found in dataframe.")
            
        self.logger.info("Starting feature engineering...")
        
        # 1. Handle missing values
        df_clean = self._impute_missing(df, target_col)
        
        features_added = []
        
        # Identify numerical columns for transformations
        num_cols = df_clean.select_dtypes(include=[np.number]).columns.tolist()
        if target_col in num_cols:
            num_cols.remove(target_col)
            
        # 2. Add Polynomial/Interaction Features
        if len(num_cols) > 0:
            # Limit to a small number of features to prevent explosion
            poly_cols = num_cols[:min(5, len(num_cols))]
            poly = PolynomialFeatures(degree=2, interaction_only=False, include_bias=False)
            
            # Fit and transform
            try:
                poly_features = poly.fit_transform(df_clean[poly_cols])
                poly_feature_names = poly.get_feature_names_out(poly_cols)
                
                # Keep only new features
                new_features_idx = [i for i, name in enumerate(poly_feature_names) if name not in poly_cols]
                new_poly_names = [poly_feature_names[i] for i in new_features_idx]
                
                if new_poly_names:
                    df_poly = pd.DataFrame(poly_features[:, new_features_idx], columns=new_poly_names, index=df_clean.index)
                    df_clean = pd.concat([df_clean, df_poly], axis=1)
                    features_added.extend(new_poly_names)
            except Exception as e:
                self.logger.warning(f"Could not compute polynomial features: {e}")
        
        # 3. Binning for Continuous Features
        if len(num_cols) > 0:
            bin_cols = num_cols[:min(3, len(num_cols))]
            # n_bins depends on number of unique values in columns, to avoid errors with low cardinality let's use 3 bins.
            kbins = KBinsDiscretizer(n_bins=3, encode='ordinal', strategy='uniform')
            
            try:
                binned_features = kbins.fit_transform(df_clean[bin_cols])
                binned_names = [f"{col}_binned" for col in bin_cols]
                
                df_binned = pd.DataFrame(binned_features, columns=binned_names, index=df_clean.index)
                df_clean = pd.concat([df_clean, df_binned], axis=1)
                features_added.extend(binned_names)
            except Exception as e:
                self.logger.warning(f"Could not compute binned features: {e}")

        # 4. Feature Importance using Random Forest
        # Prepare data for RF (only numeric for simplicity in quick check)
        X = df_clean.select_dtypes(include=[np.number]).drop(columns=[target_col], errors='ignore')
        y = df_clean[target_col]
        
        importance_dict = {}
        if not X.empty:
            # Check if target is continuous or categorical
            if pd.api.types.is_numeric_dtype(y) and len(y.unique()) > 20:
                rf = RandomForestRegressor(n_estimators=50, random_state=42)
            else:
                rf = RandomForestClassifier(n_estimators=50, random_state=42)
                # Ensure y is properly encoded if categorical
                if y.dtype == 'object' or y.dtype.name == 'category':
                    y = y.astype('category').cat.codes
                    
            try:
                # Handle any remaining NaNs in X (should be handled by impute, but just in case)
                X_clean = X.fillna(0)
                rf.fit(X_clean, y)
                importances = rf.feature_importances_
                importance_dict = dict(zip(X_clean.columns, importances))
                
                # Sort importances
                importance_dict = dict(sorted(importance_dict.items(), key=lambda item: item[1], reverse=True))
            except Exception as e:
                self.logger.warning(f"Could not compute feature importance: {e}")

        # Suggest optimal combinations (e.g., top N features)
        top_n = min(10, len(importance_dict))
        optimal_features = list(importance_dict.keys())[:top_n]

        result = {
            'df': df_clean,
            'features_added': features_added,
            'importance': importance_dict,
            'optimal_features': optimal_features
        }
        
        return result
