# ricettario/urls.py

from django.urls import path
from . import views

app_name = 'ricettario' # Definisce uno spazio nomi per le URL dell'app

urlpatterns = [
    path('', views.lista_ricette, name='lista_ricette'), # URL per la lista di tutte le ricette
    path('ricette/<int:numero_ricetta>/', views.dettaglio_ricetta, name='dettaglio_ricetta'), # URL per il dettaglio di una ricetta
    # Aggiungeremo altre URL in seguito (es. per libri, regioni, ecc.)
]