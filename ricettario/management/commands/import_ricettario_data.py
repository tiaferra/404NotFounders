# ricettario/management/commands/import_ricettario_data.py

import csv
import os
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from ricettario.models import Regione, Ricetta, RicettaRegionale, Ingrediente, Libro, Pagina, RicettaPubblicata
from django.conf import settings

class Command(BaseCommand):
    help = 'Importa i dati del ricettario dai file CSV.'

    def handle(self, *args, **options):
        # Percorso della directory dove si trovano i tuoi file CSV
        data_dir = os.path.join(settings.BASE_DIR, 'data')

        # --- Importazione Regione ---
        self.stdout.write(self.style.SUCCESS('Importazione Regioni...'))
        try:
            with open(os.path.join(data_dir, 'Regione.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    Regione.objects.get_or_create(
                        codice=row['cod'],
                        defaults={'nome': row['nome']}
                    )
            self.stdout.write(self.style.SUCCESS('Regioni importate con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File Regione.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione delle Regioni: {e}")

        # --- Importazione Libro ---
        self.stdout.write(self.style.SUCCESS('Importazione Libri...'))
        try:
            with open(os.path.join(data_dir, 'Libro.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    Libro.objects.get_or_create(
                        codice_isbn=row['codISBN'], # Attenzione: il CSV ha 'codISBN'
                        defaults={'titolo': row['titolo'], 'anno': int(row['anno'])}
                    )
            self.stdout.write(self.style.SUCCESS('Libri importati con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File Libro.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione dei Libri: {e}")

        # --- Importazione Ricetta ---
        self.stdout.write(self.style.SUCCESS('Importazione Ricette...'))
        try:
            with open(os.path.join(data_dir, 'Ricetta.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    # Assumi che voto_medio, preparazione, tempo_preparazione, difficolta non siano nel CSV Ricetta
                    # Se lo fossero, dovresti aggiungere i loro valori.
                    # Per ora, li impostiamo a None per evitare errori se non ci sono.
                    # Adatta questi campi se il tuo CSV Ricetta li contiene!
                    # ESEMPIO: preparazione=row.get('preparazione', None)
                    Ricetta.objects.get_or_create(
                        numero=int(row['numero']),
                        defaults={
                            'titolo': row['titolo'],
                            'tipo': row['tipo'],
                            'preparazione': None, # O il valore dal CSV se presente
                            'tempo_preparazione': None, # O il valore dal CSV se presente
                            'difficolta': None, # O il valore dal CSV se presente
                            'voto_medio': None, # O il valore dal CSV se presente
                        }
                    )
            self.stdout.write(self.style.SUCCESS('Ricette importate con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File Ricetta.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione delle Ricette: {e}")

        # --- Importazione Pagina ---
        self.stdout.write(self.style.SUCCESS('Importazione Pagine...'))
        try:
            with open(os.path.join(data_dir, 'Pagina.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    try:
                        libro = Libro.objects.get(codice_isbn=row['libro'])
                        Pagina.objects.get_or_create(
                            libro=libro,
                            numero_pagina=int(row['numeroPagina']) # Attenzione: il CSV ha 'numeroPagina'
                        )
                    except Libro.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Libro con ISBN {row['libro']} non trovato per Pagina {row['numeroPagina']}. Saltata."))
            self.stdout.write(self.style.SUCCESS('Pagine importate con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File Pagina.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione delle Pagine: {e}")

        # --- Importazione Ingrediente ---
        self.stdout.write(self.style.SUCCESS('Importazione Ingredienti...'))
        try:
            with open(os.path.join(data_dir, 'Ingrediente.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    try:
                        ricetta = Ricetta.objects.get(numero=int(row['numeroRicetta'])) # Attenzione: il CSV ha 'numeroRicetta'
                        Ingrediente.objects.get_or_create(
                            ricetta=ricetta,
                            numero_progressivo=int(row['numero']), # 'numero' nel CSV Ingrediente per numero progressivo
                            defaults={
                                'ingrediente': row['ingrediente'],
                                'quantita': row['quantità'] # Attenzione: il CSV ha 'quantità' con l'accento
                            }
                        )
                    except Ricetta.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Ricetta con numero {row['numeroRicetta']} non trovata per Ingrediente {row['ingrediente']}. Saltato."))
            self.stdout.write(self.style.SUCCESS('Ingredienti importati con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File Ingrediente.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione degli Ingredienti: {e}")

        # --- Importazione RicettaRegionale (relazione ManyToMany) ---
        self.stdout.write(self.style.SUCCESS('Importazione Ricette Regionali...'))
        try:
            with open(os.path.join(data_dir, 'RicettaRegionale.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    try:
                        ricetta = Ricetta.objects.get(numero=int(row['ricetta']))
                        regione = Regione.objects.get(codice=row['regione']) # Il CSV ha 'regione' per il codice
                        RicettaRegionale.objects.get_or_create(
                            ricetta=ricetta,
                            regione=regione
                        )
                    except (Ricetta.DoesNotExist, Regione.DoesNotExist):
                        self.stdout.write(self.style.WARNING(f"Ricetta {row['ricetta']} o Regione {row['regione']} non trovata per RicettaRegionale. Saltata."))
            self.stdout.write(self.style.SUCCESS('Ricette Regionali importate con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File RicettaRegionale.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione delle Ricette Regionali: {e}")

        # --- Importazione RicettaPubblicata (relazione ManyToMany) ---
        self.stdout.write(self.style.SUCCESS('Importazione Ricette Pubblicate...'))
        try:
            with open(os.path.join(data_dir, 'RicettaPubblicata.csv'), newline='', encoding='utf-8-sig') as csvfile:
                reader = csv.DictReader(csvfile, delimiter=';')
                for row in reader:
                    try:
                        ricetta = Ricetta.objects.get(numero=int(row['numeroRicetta'])) # Attenzione: il CSV ha 'numeroRicetta'
                        # Per Pagina, dobbiamo trovare la pagina corretta usando sia libro che numeroPagina
                        libro = Libro.objects.get(codice_isbn=row['libro']) # Il CSV ha 'libro' per il codice ISBN
                        pagina = Pagina.objects.get(libro=libro, numero_pagina=int(row['numeroPagina'])) # Il CSV ha 'numeroPagina'
                        
                        RicettaPubblicata.objects.get_or_create(
                            ricetta=ricetta,
                            pagina=pagina
                        )
                    except (Ricetta.DoesNotExist, Libro.DoesNotExist, Pagina.DoesNotExist):
                        self.stdout.write(self.style.WARNING(f"Ricetta {row['numeroRicetta']}, Libro {row['libro']} o Pagina {row['numeroPagina']} non trovata per RicettaPubblicata. Saltata."))
            self.stdout.write(self.style.SUCCESS('Ricette Pubblicate importate con successo!'))
        except FileNotFoundError:
            raise CommandError(f"File RicettaPubblicata.csv non trovato in {data_dir}")
        except Exception as e:
            raise CommandError(f"Errore durante l'importazione delle Ricette Pubblicate: {e}")
        
        self.stdout.write(self.style.SUCCESS('Tutti i dati del ricettario sono stati importati!'))