import os
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from dotenv import load_dotenv
from .models import GreenAction
from .serializers import GreenActionSerializer

# Load environment variables
load_dotenv()

class GreenActionViewSet(viewsets.ModelViewSet):
    queryset = GreenAction.objects.all()
    serializer_class = GreenActionSerializer

@api_view(['POST'])
def chat_with_ai(request):
    user_message = (request.data.get('message') or '').strip()
    
    # Get key inside the view to ensure it's loaded
    # Collect available provider keys
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    
    if not (openai_key or groq_key or openrouter_key):
        print("ERROR: No provider API key found in .env file")
        return Response({'reply': "I'm having trouble reaching the AI service. Please add an API key in backend/.env."}, status=200)

    try:
        def try_provider(endpoint, key, model):
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            }
            payload = {
                "model": model,
                "temperature": 0.3,
                "max_tokens": 256,
                "messages": [
                    {"role": "system", "content": "You are LeafIt AI, a sustainability expert for a hackathon at Chitkara University."},
                    {"role": "user", "content": user_message},
                ],
            }
            last_error = None
            for delay in [0, 1, 3]:
                if delay:
                    import time
                    time.sleep(delay)
                try:
                    r = requests.post(endpoint, json=payload, headers=headers, timeout=30)
                    if r.status_code == 200:
                        data = r.json()
                        return data["choices"][0]["message"]["content"], None
                    last_error = r.text
                except Exception as inner_e:
                    last_error = str(inner_e)
            return None, last_error

        # Try Groq FIRST (free), then OpenAI, then OpenRouter
        providers = []
        if groq_key:
            providers.append(("https://api.groq.com/openai/v1/chat/completions", groq_key, "llama-3.3-70b-versatile"))
        if openai_key:
            providers.append(("https://api.openai.com/v1/chat/completions", openai_key, "gpt-4o-mini"))
        if openrouter_key:
            providers.append(("https://openrouter.ai/api/v1/chat/completions", openrouter_key, "meta-llama/llama-3.3-70b-instruct"))

        for endpoint, key, model in providers:
            reply, err = try_provider(endpoint, key, model)
            if reply:
                return Response({"reply": reply})
            if err:
                print(f"DEBUG PROVIDER ERROR: {err}")

        # Local helpful fallback if all providers fail
        fallback = (
            "Here are a few practical green actions you can take:\n"
            "• Reduce energy use: switch to LED, unplug idle chargers.\n"
            "• Save water: fix leaks, take shorter showers.\n"
            "• Lower waste: carry a bottle, recycle paper/plastic.\n"
            "• Commute greener: walk, cycle, or carpool when possible.\n"
            "• Eat smart: cut food waste, try more plant-based meals.\n"
            "Ask me for tips tailored to your home, campus, or office."
        )
        return Response({"reply": fallback}, status=200)
    except Exception as e:
        print(f"DEBUG OPENAI ERROR: {str(e)}")
        return Response({"error": str(e)}, status=500)