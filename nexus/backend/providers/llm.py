import requests
import os
from core.config import settings

class LLMProvider:
    def __init__(self):
        self.base_url = "http://localhost:11434/api"
        self.model = settings.LLM_MODEL
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        
    def generate(self, prompt: str, system_prompt: str = None) -> str:
        if self.gemini_api_key:
            # Optional Cloud Adapter
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
            payload = {
                "contents": [{"parts": [{"text": (system_prompt + "\n\n" if system_prompt else "") + prompt}]}]
            }
            try:
                response = requests.post(url, json=payload, timeout=60)
                response.raise_for_status()
                return response.json()["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                print(f"Gemini API Error: {e}")
                raise e
                
        # Local Ollama Provider
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        if system_prompt:
            payload["system"] = system_prompt
            
        try:
            response = requests.post(f"{self.base_url}/generate", json=payload, timeout=60)
            response.raise_for_status()
            return response.json().get("response", "")
        except requests.exceptions.ConnectionError:
            print("LLM Error: Connection refused. Is Ollama running on localhost:11434?")
            raise Exception("LLM Provider unreachable. Please start Ollama or set GEMINI_API_KEY.")
        except Exception as e:
            print(f"LLM Error: {e}")
            raise e

llm_provider = LLMProvider()
