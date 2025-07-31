# Progetto Web: Ricettario 404NotFounders

Questo documento serve a riassumere lo stato del progetto, le tecnologie utilizzate e le istruzioni per la configurazione e il flusso di lavoro collaborativo.

## 1. Obiettivo del Progetto

Stiamo sviluppando un'applicazione web basata su Django per gestire un ricettario. L'obiettivo è importare dati da file CSV (originariamente da un Excel) in un database relazionale (SQLite) e visualizzarli tramite un'interfaccia web moderna e responsiva.

## 2. Tecnologie Utilizzate

* **Backend:** Python 3.x con Django
* **Database:** SQLite3 (database di default di Django, gestito automaticamente tramite ORM)
* **Frontend:** HTML, CSS, JavaScript (per ora con Bootstrap 5 per lo styling)
* **Controllo Versione:** Git / GitHub
* **Gestione Dipendenze Python:** Ambienti virtuali (`venv`) e `requirements.txt`

## 3. Struttura del Progetto

La struttura principale della nostra applicazione Django è:
404NotFounders/
├── RicettarioWeb/          # Configurazione principale del progetto Django
│   ├── settings.py         # Impostazioni del progetto
│   ├── urls.py             # URL principali del progetto
│   └── ...
├── ricettario/             # La nostra applicazione Django per il ricettario
│   ├── models.py           # Definizioni dei modelli del database (Ricetta, Ingrediente, ecc.)
│   ├── views.py            # Logica delle pagine web (cosa mostrare)
│   ├── urls.py             # URL specifiche dell'app 'ricettario'
│   ├── templates/          # Cartella per i template HTML
│   │   └── ricettario/     # Sottocartella specifica dell'app per i template
│   │       ├── base.html       # Template base con Bootstrap
│   │       ├── lista_ricette.html
│   │       └── dettaglio_ricetta.html
│   └── management/commands/
│       └── import_ricettario_data.py # Script per l'importazione dati da CSV
├── data/                   # Cartella contenente i file CSV per l'importazione
│   ├── Ingrediente.csv
│   ├── Libro.csv
│   └── ... (tutti i CSV)
├── myenv/                  # Ambiente Virtuale Python (IGNORATO da Git)
├── manage.py               # Utility di Django per l'amministrazione del progetto
├── requirements.txt        # Elenco delle dipendenze Python del progetto (TRACCIATO da Git)
└── .gitignore              # File che indica a Git cosa ignorare

## 4. Setup Iniziale del Progetto (per un nuovo clone o dopo pulizia)

Se stai configurando il progetto per la prima volta, o se hai eliminato la tua cartella `myenv` e vuoi ricominciare da zero, segui questi passaggi:

1.  **Clona il repository:**
    ```bash
    git clone <URL_DEL_TUO_REPOSITORY>
    cd 404NotFounders
    ```

2.  **Crea l'ambiente virtuale:**
    Questo isola le dipendenze Python del progetto. La cartella `myenv` verrà creata.
    ```bash
    python -m venv myenv
    ```

3.  **Attiva l'ambiente virtuale:**
    Devi attivare l'ambiente ogni volta che apri un nuovo terminale per lavorare al progetto.
    ```powershell
    # Su Windows PowerShell:
    .\myenv\Scripts\activate
    ```
    (Vedrai `(myenv)` all'inizio del prompt del terminale una volta attivato.)

4.  **Installa le dipendenze Python:**
    Questo comando legge il file `requirements.txt` e installa tutte le librerie necessarie (come Django) nel tuo ambiente virtuale.
    ```bash
    pip install -r requirements.txt
    ```

5.  **Applica le migrazioni del database:**
    Questo comando crea le tabelle nel database SQLite basandosi sui modelli Django.
    ```bash
    python manage.py migrate
    ```

6.  **Importa i dati iniziali:**
    Questo è il nostro script personalizzato per caricare i dati dai file CSV nel database.
    **Assicurati che i file CSV siano nella cartella `data/` con i nomi corretti (es. `Regione.csv`, `Ricetta.csv`, ecc. - senza prefissi o estensioni doppie).**
    ```bash
    python manage.py import_ricettario_data
    ```

7.  **Avvia il server di sviluppo:**
    ```bash
    python manage.py runserver
    ```
    Ora puoi aprire il browser e visitare `http://127.0.0.1:8000/` per vedere l'applicazione.

## 5. Flusso di Lavoro Quotidiano e Gestione delle Dipendenze

Per lavorare efficacemente in team, segui questo processo:

1.  **Prima di iniziare a lavorare ogni giorno:**
    * Apri il terminale e naviga alla directory del progetto.
    * **Attiva l'ambiente virtuale:** `.\myenv\Scripts\activate`
    * **Tira giù le ultime modifiche dal repository:** `git pull`
    * **Controlla se `requirements.txt` è cambiato:** Se `git pull` ha aggiornato `requirements.txt`, devi aggiornare le tue librerie:
        ```bash
        pip install -r requirements.txt
        ```
    * **Controlla se ci sono nuove migrazioni:** Se qualcuno ha modificato i modelli del database, esegui:
        ```bash
        python manage.py migrate
        ```

2.  **Quando installi nuove librerie Python (es. `pip install nome_libreria`):**
    * **DOPO** aver installato la nuova libreria nel tuo `myenv` attivo.
    * **DEVI rigenerare e committare il `requirements.txt`:**
        ```bash
        pip freeze > requirements.txt
        git add requirements.txt
        git commit -m "Aggiunta nuova libreria: nome_libreria"
        git push origin <nome_del_tuo_branch>
        ```
    Questo è cruciale affinché il tuo collega possa avere la stessa dipendenza.

3.  **Quando modifichi i modelli del database (`models.py`):**
    * Crea le migrazioni: `python manage.py makemigrations`
    * Applica le migrazioni (solo in locale): `python manage.py migrate`
    * **Committa sia le modifiche a `models.py` che i nuovi file di migrazione (`000X_*.py` nella cartella `ricettario/migrations/`) e fai un `push`.**

## 6. Stato Attuale del Progetto

* **Dati:** Tutti i dati da `ricettario_completo.xlsx` sono stati importati con successo nel database SQLite locale tramite lo script `import_ricettario_data.py`.
* **Interfaccia Utente:**
    * L'applicazione è configurata per visualizzare una lista di ricette sulla homepage (`/`).
    * Ogni ricetta ha una pagina di dettaglio (`/ricette/<numero_ricetta>/`).
    * I template sono stati integrati con **Bootstrap 5** per un aspetto moderno e responsive.
* **Prossimi Passi (Potenziali):**
    * Aggiungere pagine per Libri, Regioni, ecc.
    * Migliorare la navigazione.
    * Implementare una funzione di ricerca.
    * Sviluppare funzionalità CRUD (creazione/lettura/aggiornamento/eliminazione) dal frontend.

