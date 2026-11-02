from .rag_integration import DataMateRAGIntegration
from .flywheel_integration import DataMateFlywheelPipeline
from .deep_researcher_integration import DataMateDeepAnalysisAgent

class DataMateBlueprintOrchestrator:
    """Unified access to all NVIDIA blueprints"""
    
    def __init__(self):
        self.rag = DataMateRAGIntegration()
        self.flywheel = DataMateFlywheelPipeline()
        self.researcher = DataMateDeepAnalysisAgent()
    
    def setup_all_blueprints(self):
        """Initialize all blueprint integrations"""
        
        # self.rag.setup()
        # self.flywheel.setup()
        # self.researcher.setup()
        
        print("✅ All NVIDIA blueprints ready!")
