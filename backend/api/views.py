import os
from openai import OpenAI
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
    user_message = request.data.get('message')
    
    # Get key inside the view to ensure it's loaded
    api_key = os.getenv("OPEN_API_KEY")
    
    if not api_key:
        print("ERROR: OPEN_API_KEY is missing from .env file")
        return Response({'error': 'Backend configuration error: Key missing'}, status=500)

    try:
        # Initialize client here
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are EnvoX AI, a sustainability expert for a hackathon at Chitkara University."},
                {"role": "user", "content": user_message}
            ]
        )
        
        reply = response.choices[0].message.content
        return Response({'reply': reply})
    
    except Exception as e:
        # Check your Django terminal to see this output!
        print(f"DEBUG OPENAI ERROR: {str(e)}") 
        return Response({'error': str(e)}, status=500)