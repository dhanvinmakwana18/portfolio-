from backend.cli.utils.dependency import get_intelligence_core

class NemotronOrchestrator:
    """
    Orchestrates autonomous agent generation and evolution loops.
    """
    
    def __init__(self):
        self.core = get_intelligence_core()
        self.llm = self.core.llm

    def request_agent_generation(self, specification: str) -> str:
        """
        Prompts the LLM to write a complete Python class for a new agent.
        """
        prompt = (
            f"Write a complete Python class for a new agent based on the following specification:\n"
            f"{specification}\n\n"
            f"Output ONLY raw Python code. Do not include any markdown formatting, backticks, or explanations."
        )
        return self.llm.generate(prompt)

    def improve_agent(self, current_code: str, current_score: float, metric: str) -> str:
        """
        Prompts the LLM to refactor and optimize the agent's code to improve the specified metric.
        """
        prompt = (
            f"Refactor and optimize the following agent code to improve the metric '{metric}'.\n"
            f"The current score for this metric is {current_score}.\n\n"
            f"Current Code:\n{current_code}\n\n"
            f"Output ONLY raw Python code. Do not include any markdown formatting, backticks, or explanations."
        )
        return self.llm.generate(prompt)
