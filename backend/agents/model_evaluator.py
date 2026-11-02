import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
from sklearn.model_selection import RandomizedSearchCV, ParameterGrid
from sklearn.metrics import (
    accuracy_score, roc_auc_score, classification_report,
    mean_squared_error, r2_score, mean_absolute_error
)
from sklearn.linear_model import (
    LogisticRegression, Ridge, Lasso, ElasticNet
)
from sklearn.ensemble import (
    RandomForestClassifier, RandomForestRegressor,
    GradientBoostingClassifier, GradientBoostingRegressor,
    AdaBoostClassifier, AdaBoostRegressor,
    ExtraTreesClassifier, ExtraTreesRegressor
)
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier, MLPRegressor
import warnings

# Ignore convergence warnings during hyperparameter tuning
warnings.filterwarnings('ignore')

class ModelEvaluationAgent:
    """
    An agent that automatically evaluates multiple machine learning algorithms
    for either classification or regression tasks, performing hyperparameter tuning
    and cross-validation to select the best model.
    """
    
    def __init__(self):
        pass
        
    def _get_classification_models(self) -> dict:
        return {
            'LogisticRegression': {
                'model': LogisticRegression(max_iter=1000),
                'params': {'C': [0.01, 0.1, 1.0, 10.0], 'penalty': ['l2']}
            },
            'RandomForestClassifier': {
                'model': RandomForestClassifier(random_state=42),
                'params': {'n_estimators': [50, 100, 200], 'max_depth': [None, 10, 20]}
            },
            'GradientBoostingClassifier': {
                'model': GradientBoostingClassifier(random_state=42),
                'params': {'n_estimators': [50, 100], 'learning_rate': [0.01, 0.1, 0.2]}
            },
            'SVC': {
                'model': SVC(probability=True, random_state=42),
                'params': {'C': [0.1, 1, 10], 'kernel': ['linear', 'rbf']}
            },
            'KNeighborsClassifier': {
                'model': KNeighborsClassifier(),
                'params': {'n_neighbors': [3, 5, 7, 9], 'weights': ['uniform', 'distance']}
            },
            'DecisionTreeClassifier': {
                'model': DecisionTreeClassifier(random_state=42),
                'params': {'max_depth': [None, 5, 10, 20], 'min_samples_split': [2, 5, 10]}
            },
            'GaussianNB': {
                'model': GaussianNB(),
                'params': {'var_smoothing': np.logspace(0, -9, num=10)}
            },
            'MLPClassifier': {
                'model': MLPClassifier(max_iter=500, random_state=42),
                'params': {'hidden_layer_sizes': [(50,), (100,), (50, 50)], 'alpha': [0.0001, 0.05]}
            },
            'AdaBoostClassifier': {
                'model': AdaBoostClassifier(random_state=42),
                'params': {'n_estimators': [50, 100], 'learning_rate': [0.1, 1.0]}
            },
            'ExtraTreesClassifier': {
                'model': ExtraTreesClassifier(random_state=42),
                'params': {'n_estimators': [50, 100], 'max_depth': [None, 10, 20]}
            }
        }

    def _get_regression_models(self) -> dict:
        return {
            'Ridge': {
                'model': Ridge(),
                'params': {'alpha': [0.1, 1.0, 10.0]}
            },
            'Lasso': {
                'model': Lasso(),
                'params': {'alpha': [0.1, 1.0, 10.0]}
            },
            'ElasticNet': {
                'model': ElasticNet(),
                'params': {'alpha': [0.1, 1.0], 'l1_ratio': [0.2, 0.5, 0.8]}
            },
            'RandomForestRegressor': {
                'model': RandomForestRegressor(random_state=42),
                'params': {'n_estimators': [50, 100], 'max_depth': [None, 10, 20]}
            },
            'GradientBoostingRegressor': {
                'model': GradientBoostingRegressor(random_state=42),
                'params': {'n_estimators': [50, 100], 'learning_rate': [0.01, 0.1, 0.2]}
            },
            'SVR': {
                'model': SVR(),
                'params': {'C': [0.1, 1, 10], 'kernel': ['linear', 'rbf']}
            },
            'KNeighborsRegressor': {
                'model': KNeighborsRegressor(),
                'params': {'n_neighbors': [3, 5, 7, 9], 'weights': ['uniform', 'distance']}
            },
            'DecisionTreeRegressor': {
                'model': DecisionTreeRegressor(random_state=42),
                'params': {'max_depth': [None, 5, 10, 20], 'min_samples_split': [2, 5, 10]}
            },
            'MLPRegressor': {
                'model': MLPRegressor(max_iter=500, random_state=42),
                'params': {'hidden_layer_sizes': [(50,), (100,)], 'alpha': [0.0001, 0.05]}
            },
            'AdaBoostRegressor': {
                'model': AdaBoostRegressor(random_state=42),
                'params': {'n_estimators': [50, 100], 'learning_rate': [0.1, 1.0]}
            },
            'ExtraTreesRegressor': {
                'model': ExtraTreesRegressor(random_state=42),
                'params': {'n_estimators': [50, 100], 'max_depth': [None, 10, 20]}
            }
        }

    def execute(self, X_train, X_test, y_train, y_test, is_classification: bool) -> Dict[str, Any]:
        """
        Executes the evaluation of multiple models.
        
        Args:
            X_train: Training features.
            X_test: Testing features.
            y_train: Training labels/targets.
            y_test: Testing labels/targets.
            is_classification: Boolean flag indicating if the task is classification or regression.
            
        Returns:
            Dict containing best_model, name, metrics (accuracy/auc or r2/mse) and a report string.
        """
        if is_classification:
            models = self._get_classification_models()
            scoring = 'accuracy'
        else:
            models = self._get_regression_models()
            scoring = 'r2'

        best_model_name = None
        best_model = None
        best_score = -float('inf')
        best_metrics = {}

        for name, config in models.items():
            print(f"Evaluating {name}...")
            param_size = len(list(ParameterGrid(config['params'])))
            n_iter = min(10, param_size)
            
            search = RandomizedSearchCV(
                estimator=config['model'],
                param_distributions=config['params'],
                n_iter=n_iter,
                cv=3,
                scoring=scoring,
                n_jobs=-1,
                random_state=42
            )
            
            try:
                search.fit(X_train, y_train)
                model = search.best_estimator_
                y_pred = model.predict(X_test)
                
                if is_classification:
                    acc = accuracy_score(y_test, y_pred)
                    
                    try:
                        if hasattr(model, "predict_proba"):
                            y_prob = model.predict_proba(X_test)
                            if len(np.unique(y_test)) > 2:
                                auc = roc_auc_score(y_test, y_prob, multi_class='ovr')
                            else:
                                auc = roc_auc_score(y_test, y_prob[:, 1])
                        else:
                            auc = 0.0
                    except Exception:
                        auc = 0.0

                    report = classification_report(y_test, y_pred)
                    score = acc
                    metrics = {'accuracy': float(acc), 'auc': float(auc), 'report': report}
                else:
                    r2 = r2_score(y_test, y_pred)
                    mse = mean_squared_error(y_test, y_pred)
                    mae = mean_absolute_error(y_test, y_pred)
                    score = r2
                    report = f"R2 Score: {r2:.4f}\nMSE: {mse:.4f}\nMAE: {mae:.4f}"
                    metrics = {'r2': float(r2), 'mse': float(mse), 'mae': float(mae), 'report': report}

                print(f"{name} Score ({scoring}): {score:.4f}")

                if score > best_score:
                    best_score = score
                    best_model_name = name
                    best_model = model
                    best_metrics = metrics

            except Exception as e:
                print(f"Error training {name}: {e}")

        result = {
            'best_model': best_model,
            'name': best_model_name if best_model_name else "None",
            'report': best_metrics.get('report', "No models trained successfully.")
        }
        
        if is_classification:
            result['accuracy'] = best_metrics.get('accuracy', 0.0)
            result['auc'] = best_metrics.get('auc', 0.0)
        else:
            result['r2'] = best_metrics.get('r2', 0.0)
            result['mse'] = best_metrics.get('mse', 0.0)
            result['mae'] = best_metrics.get('mae', 0.0)

        return result
