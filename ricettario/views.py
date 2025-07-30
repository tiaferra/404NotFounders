# ricettario/views.py

from django.shortcuts import render, get_object_or_404
from .models import Ricetta, Ingrediente, Regione, Libro, Pagina # Importa i modelli necessari

def lista_ricette(request):
    """
    Vista per visualizzare l'elenco di tutte le ricette.
    """
    ricette = Ricetta.objects.all().order_by('titolo') # Recupera tutte le ricette, ordinate per titolo
    context = {
        'ricette': ricette
    }
    return render(request, 'ricettario/lista_ricette.html', context)

def dettaglio_ricetta(request, numero_ricetta):
    """
    Vista per visualizzare i dettagli di una singola ricetta.
    """
    ricetta = get_object_or_404(Ricetta, numero=numero_ricetta) # Recupera la ricetta per numero, o restituisce 404

    # Possiamo accedere direttamente agli ingredienti tramite il related_name 'ingredienti' nel modello Ricetta
    ingredienti = ricetta.ingredienti.all().order_by('numero_progressivo')

    # Recuperiamo le regioni associate
    regioni = ricetta.regioni.all() # Questo usa la relazione ManyToMany con la tabella through

    # Recuperiamo le pubblicazioni (libri e pagine)
    pubblicazioni = ricetta.ricettapubblicata_set.all() # Accesso inverso tramite _set

    context = {
        'ricetta': ricetta,
        'ingredienti': ingredienti,
        'regioni': regioni,
        'pubblicazioni': pubblicazioni,
    }
    return render(request, 'ricettario/dettaglio_ricetta.html', context)