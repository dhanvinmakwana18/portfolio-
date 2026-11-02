import ast
import os
from pathlib import Path

class ValidationSuite:
    """
    Validates generated agent code for syntax and basic safety.
    """
    def __init__(self):
        self.errors = []

    def run(self, code: str) -> bool:
        self.errors = []
        
        # 1. Syntax check
        try:
            ast.parse(code)
        except SyntaxError as e:
            self.errors.append(f"Syntax error: {e}")
            return False
            
        # 2. Safety check
        if "os.system" in code:
            self.errors.append("Safety violation: code contains 'os.system'")
        if "subprocess" in code:
            self.errors.append("Safety violation: code contains 'subprocess'")
            
        return len(self.errors) == 0

class AgentCreatorAgent:
    """
    Creates new specialized agents autonomously.
    """
    def __init__(self, orchestrator):
        self.orchestrator = orchestrator
        self.validation_suite = ValidationSuite()

    def create_agent(self, specification: str, agent_name: str) -> bool:
        """
        1. Request code from orchestrator
        2. Run validation
        3. If fail, ask orchestrator to fix (max 3 retries)
        4. If pass, write the string to backend/agents/{agent_name}.py
        """
        agent_code = self.orchestrator.request_agent_generation(specification)
        
        max_retries = 3
        for attempt in range(max_retries + 1):
            # Clean up potential markdown formatting from LLM
            cleaned_code = agent_code.strip()
            if cleaned_code.startswith("```python"):
                cleaned_code = cleaned_code[9:]
            elif cleaned_code.startswith("```"):
                cleaned_code = cleaned_code[3:]
            if cleaned_code.endswith("```"):
                cleaned_code = cleaned_code[:-3]
            cleaned_code = cleaned_code.strip()

            is_valid = self.validation_suite.run(cleaned_code)
            
            if is_valid:
                # Deploy it
                agents_dir = Path(__file__).parent.parent / "agents"
                agents_dir.mkdir(parents=True, exist_ok=True)
                
                file_path = agents_dir / f"{agent_name}.py"
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(cleaned_code)
                return True
                
            if attempt < max_retries:
                # Ask orchestrator to fix
                error_msgs = "\n".join(self.validation_suite.errors)
                prompt = (
                    f"The following code failed validation with errors:\n{error_msgs}\n\n"
                    f"Code:\n{cleaned_code}\n\n"
                    f"Please fix the code and output ONLY raw Python code. Do not include markdown blocks."
                )
                
                if hasattr(self.orchestrator, 'refine_agent_code'):
                    agent_code = self.orchestrator.refine_agent_code(
                        original=cleaned_code,
                        errors=self.validation_suite.errors
                    )
                else:
                    agent_code = self.orchestrator.llm.generate(prompt)
                
        return False
