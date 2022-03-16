from django.shortcuts import render

# Create your views here.

def pomodoro(request):
    """View function for pomodoro page"""
    return render(request, 'pomodoro.html')