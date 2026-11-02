import os
import sys
import importlib
import inspect

class AutonomousEvolutionLoop:
    def __init__(
        self, 
        agent_name: str, 
        orchestrator, 
        metric: str = "accuracy", 
        max_iterations: int = 5, 
        convergence_threshold: float = 0.01
    ):
        self.agent_name = agent_name
        self.orchestrator = orchestrator
        self.metric = metric
        self.max_iterations = max_iterations
        self.convergence_threshold = convergence_threshold
        
        self.best_score = None
        self.best_code = None

    def _get_agent_path(self) -> str:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(current_dir)
        return os.path.join(backend_dir, "agents", f"{self.agent_name}.py")

    def _read_agent_code(self) -> str:
        path = self._get_agent_path()
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def _write_agent_code(self, code: str):
        path = self._get_agent_path()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)

    def _load_agent(self):
        module_name = f"backend.agents.{self.agent_name}"
        
        if module_name in sys.modules:
            del sys.modules[module_name]
            
        module = importlib.import_module(module_name)
        
        for name, obj in inspect.getmembers(module, inspect.isclass):
            if obj.__module__ == module_name and hasattr(obj, 'execute'):
                return obj()
                
        raise ImportError(f"No valid agent class with execute() found in {module_name}")

    def run(self, dataset, target_col):
        previous_best = None
        
        for iteration in range(self.max_iterations):
            agent = self._load_agent()
            
            current_score = agent.execute(dataset, target_col)
            
            if previous_best is not None:
                improvement = current_score - previous_best
                if improvement < self.convergence_threshold:
                    break
                    
            if self.best_score is None or current_score > self.best_score:
                self.best_score = current_score
                self.best_code = self._read_agent_code()
                
            previous_best = self.best_score
            
            improved_code = self.orchestrator.improve_agent(
                current_code=self.best_code,
                current_score=self.best_score,
                metric=self.metric
            )
            
            if not improved_code:
                break
                
            try:
                compile(improved_code, "<string>", "exec")
                is_valid = True
            except SyntaxError:
                is_valid = False
                
            if is_valid:
                self._write_agent_code(improved_code)
                
                try:
                    reloaded_agent = self._load_agent()
                    new_score = reloaded_agent.execute(dataset, target_col)
                except Exception:
                    new_score = -float('inf')
                
                if new_score < self.best_score:
                    self._write_agent_code(self.best_code)
                    
        return self.best_score, self.best_code
