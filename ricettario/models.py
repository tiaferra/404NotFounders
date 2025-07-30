from django.db import models

# Modello per la Regione (slide 17) [cite: 57]
class Regione(models.Model):
    codice = models.CharField(max_length=10, primary_key=True) # Codice della regione (es. 'LOM', 'VEN') [cite: 57]
    nome = models.CharField(max_length=100) # Nome completo della regione [cite: 57]

    def __str__(self):
        return self.nome

# Modello per la Ricetta (slide 15, 17) [cite: 49, 50, 51, 57]
class Ricetta(models.Model):
    CATEGORIE_RICETTA = [
        ('antipasto', 'Antipasto'),
        ('primo', 'Primo'),
        ('secondo', 'Secondo'),
        ('contorno', 'Contorno'),
        ('dessert', 'Dessert'),
    ]

    numero = models.IntegerField(primary_key=True) # Identificativo numerico della ricetta [cite: 49, 57]
    titolo = models.CharField(max_length=200) # Titolo della ricetta [cite: 49, 57]
    tipo = models.CharField(max_length=20, choices=CATEGORIE_RICETTA) # Categoria della ricetta [cite: 50, 57]
    # Le ricette possono essere tipiche di una o più regioni [cite: 51]
    regioni = models.ManyToManyField(Regione, through='RicettaRegionale') 
    
    # Aggiungi campi per Preparazione, Tempo, Difficoltà, Voto se facevano parte del vostro progetto originale
    # Queste informazioni non sono esplicitamente nella slide 15-17  ma sono state menzionate in precedenza.
    # Se le avete gestite nel vostro primo progetto, includetele qui.
    preparazione = models.TextField(blank=True, null=True) # Testo della preparazione
    tempo_preparazione = models.IntegerField(blank=True, null=True) # Tempo di preparazione in minuti
    difficolta = models.CharField(max_length=50, blank=True, null=True) # Es. 'Facile', 'Medio', 'Difficile'
    voto_medio = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True) # Voto medio della ricetta

    def __str__(self):
        return self.titolo

# Modello di collegamento per la relazione molti-a-molti tra Ricetta e Regione (slide 17) [cite: 57]
class RicettaRegionale(models.Model):
    regione = models.ForeignKey(Regione, on_delete=models.CASCADE)
    ricetta = models.ForeignKey(Ricetta, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('regione', 'ricetta') # Assicura che la combinazione sia unica

    def __str__(self):
        return f"{self.ricetta.titolo} - {self.regione.nome}"

# Modello per l'Ingrediente (slide 15, 17) [cite: 52, 57]
class Ingrediente(models.Model):
    # L'ingrediente è identificato da un numero progressivo proprio della ricetta [cite: 52]
    ricetta = models.ForeignKey(Ricetta, on_delete=models.CASCADE, related_name='ingredienti')
    numero_progressivo = models.IntegerField() # Numero progressivo dell'ingrediente all'interno della ricetta [cite: 52, 57]
    ingrediente = models.CharField(max_length=100) # Nome dell'ingrediente [cite: 52, 57]
    quantita = models.CharField(max_length=50) # Quantità dell'ingrediente (es. "200g", "2 cucchiai") [cite: 52, 57]

    class Meta:
        unique_together = ('ricetta', 'numero_progressivo') # Assicura l'unicità del numero progressivo per ricetta

    def __str__(self):
        return f"{self.quantita} {self.ingrediente}"

# Modello per il Libro (slide 15, 17) [cite: 53, 57]
class Libro(models.Model):
    codice_isbn = models.CharField(max_length=13, primary_key=True) # Codice ISBN (International Standard Book Number) [cite: 53, 57]
    titolo = models.CharField(max_length=255) # Titolo del libro [cite: 53, 57]
    anno = models.IntegerField() # Anno di pubblicazione [cite: 53, 57]

    def __str__(self):
        return self.titolo

# Modello per la Pagina di un Libro (slide 15, 17) [cite: 54, 57]
class Pagina(models.Model):
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE, related_name='pagine')
    numero_pagina = models.IntegerField() # Numero della pagina all'interno del libro [cite: 54, 57]
    
    class Meta:
        unique_together = ('libro', 'numero_pagina') # Assicura l'unicità del numero di pagina per libro

    def __str__(self):
        return f"Pagina {self.numero_pagina} di {self.libro.titolo}"

# Modello di collegamento per la relazione molti-a-molti tra Ricetta e Pagina (slide 15, 17) [cite: 55, 57]
class RicettaPubblicata(models.Model):
    ricetta = models.ForeignKey(Ricetta, on_delete=models.CASCADE)
    pagina = models.ForeignKey(Pagina, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('ricetta', 'pagina') # Una ricetta può essere pubblicata su una data pagina solo una volta

    def __str__(self):
        return f"{self.ricetta.titolo} su {self.pagina}"
