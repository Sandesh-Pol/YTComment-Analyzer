from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail
from django.conf import settings
import random
import string
import logging

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    OTPVerificationSerializer,
    UserSerializer
)
from .models import User, OTP

logger = logging.getLogger(__name__)

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Generate OTP
                otp_code = generate_otp()
                OTP.objects.create(user=user, otp=otp_code)
                
                # Send OTP via email
                subject = 'Email Verification OTP'
                message = f'''
                Welcome to YT Comment Analyzer!
                
                Your OTP for email verification is: {otp_code}
                
                Please use this code to verify your account.
                
                If you didn't request this, please ignore this email.
                '''
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [user.email]
                
                try:
                    send_mail(
                        subject,
                        message,
                        from_email,
                        recipient_list,
                        fail_silently=False,
                    )
                    return Response({
                        'message': 'Registration successful. Please check your email for OTP verification.',
                        'user': UserSerializer(user).data
                    }, status=status.HTTP_201_CREATED)
                except Exception as e:
                    logger.error(f"Failed to send email to {user.email}: {str(e)}")
                    # Don't delete the user, just return the error
                    return Response({
                        'message': f'Registration successful but failed to send OTP email. Please contact support.',
                        'error': str(e),
                        'user': UserSerializer(user).data
                    }, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Registration failed: {str(e)}")
                return Response({
                    'message': 'Registration failed.',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            
            try:
                user = User.objects.get(email=email)
                otp = OTP.objects.filter(user=user, otp=otp_code, is_verified=False).latest('created_at')
                
                otp.is_verified = True
                otp.save()
                
                user.is_verified = True
                user.save()
                
                return Response({
                    'message': 'Email verified successfully.',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            except (User.DoesNotExist, OTP.DoesNotExist):
                return Response({
                    'message': 'Invalid OTP or email.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                if user.is_verified:
                    login(request, user)
                    return Response({
                        'message': 'Login successful',
                        'user': UserSerializer(user).data
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'message': 'Please verify your email first.'
                    }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK) 