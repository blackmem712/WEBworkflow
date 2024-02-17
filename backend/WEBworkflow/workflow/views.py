from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'workflow/pages/cad_equip.html')