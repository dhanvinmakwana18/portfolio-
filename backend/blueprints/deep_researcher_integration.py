import os
from typing import TypedDict, Dict
from langgraph.graph import StateGraph, END
from rag_integration import DataMateRAGIntegration

# State definition for LangGraph
class AgentState(TypedDict):
    user_query: str
    intent: str
    data: list
    analysis: str
    final_report: str

class DataMateDeepAnalysisAgent:
    """NVIDIA Deep Researcher framework for DataMate (Local Implementation)"""
    
    def __init__(self):
        from dotenv import load_dotenv
        for env_path in [Path.home() / ".env.txt", Path.home() / ".env", Path(".env.txt"), Path(".env")]:
            if env_path.exists():
                load_dotenv(env_path, override=True)
                break
        self.api_key = os.getenv('NVIDIA_API_KEY')
        if not self.api_key:
            raise ValueError("NVIDIA_API_KEY not found in .env.txt or .env")
            
        # Hook into our previously built Blueprint 1 (RAG)
        self.rag = DataMateRAGIntegration()
        
        # Initialize the LangGraph
        self.graph_builder = StateGraph(AgentState)
        print("✅ Deep Researcher Agent initialized")
    
    def build_analysis_workflow(self):
        """
        Create LangGraph workflow for data analysis
        
        Uses Deep Researcher pattern:
        1. Query understanding
        2. Data retrieval
        3. Multi-step reasoning
        4. Result synthesis
        """
        
        # Add nodes
        self.graph_builder.add_node("router", self.route_query)
        self.graph_builder.add_node("data_retrieval", self.retrieve_data)
        self.graph_builder.add_node("analysis", self.analyze_data)
        self.graph_builder.add_node("synthesis", self.synthesize_results)
        
        # Add edges (linear flow for this example)
        self.graph_builder.set_entry_point("router")
        self.graph_builder.add_edge("router", "data_retrieval")
        self.graph_builder.add_edge("data_retrieval", "analysis")
        self.graph_builder.add_edge("analysis", "synthesis")
        self.graph_builder.add_edge("synthesis", END)
        
        self.workflow = self.graph_builder.compile()
        return self.workflow
    
    def route_query(self, state: AgentState):
        """Step 1: Understand query intent"""
        print(f"🚦 [Node: Router] Classifying intent for: '{state['user_query']}'")
        
        # Mocking LLM fast routing (normally Nemotron-Mini)
        if "revenue" in state['user_query'].lower() or "customer" in state['user_query'].lower():
            intent = "financial_analysis"
        else:
            intent = "general_query"
            
        state['intent'] = intent
        return state
    
    def retrieve_data(self, state: AgentState):
        """Step 2: Fetch relevant data using RAG Blueprint"""
        print(f"🔍 [Node: Retrieval] Fetching data for intent: {state['intent']}")
        
        if state['intent'] == "financial_analysis":
            # Uses our working RAG pipeline to search local Milvus
            results = self.rag.search(state['user_query'], top_k=3)
            state['data'] = results
        else:
            state['data'] = []
            
        return state
    
    def analyze_data(self, state: AgentState):
        """Step 3: Deep analysis"""
        print(f"🧠 [Node: Analysis] Running deep reasoning on retrieved data...")
        
        # Mocking complex reasoning (normally Nemotron-3-8B)
        data = state['data']
        if not data:
            state['analysis'] = "No relevant data found to analyze."
            return state
            
        analysis = f"Found {len(data)} relevant records. Top record indicates: {data[0].get('text', '')}"
        state['analysis'] = analysis
        return state
    
    def synthesize_results(self, state: AgentState):
        """Step 4: Create final report"""
        print(f"✍️ [Node: Synthesis] Generating final executive report...")
        
        report = (
            f"--- DEEP RESEARCH REPORT ---\n"
            f"Original Query: {state['user_query']}\n"
            f"Intent Detected: {state['intent']}\n"
            f"Analysis Summary:\n{state['analysis']}\n"
            f"----------------------------"
        )
        
        state['final_report'] = report
        return state
    
    def run(self, query: str):
        """Execute the graph"""
        print(f"\n🚀 Starting Deep Research workflow for query: '{query}'")
        initial_state = {
            "user_query": query,
            "intent": "",
            "data": [],
            "analysis": "",
            "final_report": ""
        }
        
        # Invoke the LangGraph workflow
        result = self.workflow.invoke(initial_state)
        return result['final_report']


if __name__ == "__main__":
    agent = DataMateDeepAnalysisAgent()
    agent.build_analysis_workflow()
    
    # Test 1: Financial Query (Should trigger RAG)
    report1 = agent.run("Who are our high revenue customers?")
    print(f"\n{report1}\n")
    
    # Test 2: General Query
    report2 = agent.run("What is the weather today?")
    print(f"\n{report2}\n")
