class DataMateAgent:
    """All DataMate agents inherit from NeMo's BaseAgent"""
    
    def __init__(self, name: str, role: str):
        # super().__init__(name=name)
        self.name = name
        self.role = role
        self.tools = []
    
    def register_tool(self, tool):
        """Register tools this agent can use"""
        self.tools.append(tool)
    
    def execute(self, task: str) -> str:
        """
        Execute task with NeMo's evaluation framework
        """
        # result = super().execute(task)
        # return result
        pass
