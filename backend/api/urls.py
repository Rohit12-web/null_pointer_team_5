from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GreenActionViewSet
from .views import chat_with_ai

router = DefaultRouter()
router.register(r'actions', GreenActionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', chat_with_ai),
]