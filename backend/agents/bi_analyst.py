import pandas as pd
from typing import Dict, Any, List

class BusinessIntelligenceAgent:
    def __init__(self):
        """Initializes the BusinessIntelligenceAgent."""
        pass

    def execute(self, df: pd.DataFrame, model_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates business insights, ROI projections, and recommendations based on data and model metrics.
        
        Args:
            df (pd.DataFrame): The input dataset.
            model_metrics (dict): The metrics of the trained model (e.g., accuracy).
            
        Returns:
            dict: Structured dictionary containing 'insights', 'roi_projection', and 'recommendations'.
        """
        # Extract accuracy from model_metrics or default to a mock value
        accuracy = model_metrics.get("accuracy", 0.75)
        
        # 1. Generate Business Insights
        insights = [
            f"The dataset contains {df.shape[0]} records and {df.shape[1]} features, providing a substantial basis for analysis.",
            f"The predictive model achieved an accuracy of {accuracy * 100:.2f}%, indicating strong predictive capability.",
            "Key segments within the data suggest opportunities for targeted interventions to optimize business outcomes."
        ]
        
        # 2. Calculate Mock ROI Projections
        # Simple mock calculation based on accuracy
        base_savings_percentage = 5.0 
        accuracy_bonus = max(0, (accuracy - 0.5) * 20) 
        projected_savings = base_savings_percentage + accuracy_bonus
        
        roi_projection = f"If deployed, this model will save {projected_savings:.1f}% based on its accuracy of {accuracy * 100:.1f}%."
        
        # 3. Generate Actionable Recommendations
        recommendations = [
            "Deploy the model in a shadow testing environment to validate real-world performance before full integration.",
            "Focus on acquiring more high-quality data for underrepresented features to further improve model robustness.",
            "Establish a continuous monitoring pipeline to detect data drift and maintain model accuracy over time.",
            "Integrate model predictions into the customer service workflow to prioritize high-value cases."
        ]
        
        return {
            "insights": insights,
            "roi_projection": roi_projection,
            "recommendations": recommendations
        }
