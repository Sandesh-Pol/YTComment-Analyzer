from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView, LogoutView

app_name = 'auth_api'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
] 