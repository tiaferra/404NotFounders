from django.contrib import admin

from .models import Regione, Ricetta, RicettaRegionale, Ingrediente, Libro, Pagina, RicettaPubblicata

# Registra i tuoi modelli qui.
admin.site.register(Regione)
admin.site.register(Ricetta)
admin.site.register(RicettaRegionale)
admin.site.register(Ingrediente)
admin.site.register(Libro)
admin.site.register(Pagina)
admin.site.register(RicettaPubblicata)
