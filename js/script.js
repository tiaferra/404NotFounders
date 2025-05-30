// Variabile globale per memorizzare i dati delle regioni
let regioniData = [];
let ricetteData = [];
let libriData = [];
// Mostra il gruppo di opzioni e nasconde le altre
function mostraOpzioni(id) {
    const gruppi = document.querySelectorAll('.options-group');
    gruppi.forEach(gruppo => {
        gruppo.style.display = 'none';
    });

    document.getElementById(id).style.display = 'block';

    const tabelle = document.querySelectorAll('table');
    tabelle.forEach(tabella => tabella.style.display = 'none');
    
    document.getElementById('tabella-container').style.display = 'block';

    document.getElementById('form-libro-container').style.display = 'none';

    if (id === 'opzioni1') {
        caricaTabellaRegione();
    } else if (id === 'opzioni2') {
        caricaTabellaRicetta();
    } else if (id === 'opzioni3') {
        caricaTabellaLibro();
    }
}

// Inizializzazione - mostra la home all'avvio
document.addEventListener('DOMContentLoaded', function() {
    mostraHome();
});

// Gestisce la selezione dei radio
document.querySelectorAll('input[name="scelta"]').forEach(radio => {
  radio.addEventListener('change', function () {
    mostraOpzioni('opzioni' + this.value.slice(-1));

    if (this.value === 'opzione1') {
      caricaTabellaRegione();
    } else if (this.value === 'opzione2') {
      caricaTabellaRicetta();
    } else if (this.value === 'opzione3') {
      caricaTabellaLibro();
    }
  });
});

// Funzione generica per mostrare i dati in una tabella
function mostraTabella(data, colonne, idTabella) {
    const tabella = document.getElementById(idTabella);
    tabella.innerHTML = "";

    // Intestazione
    const headerRow = document.createElement("tr");
    colonne.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
    });
    
    // Aggiungi colonna azioni se è la tabella libri
    if (idTabella === 'tabellaLibro') {
        const azioniHeader = document.createElement("th");
        azioniHeader.textContent = "Azioni";
        headerRow.appendChild(azioniHeader);
    }
    
    tabella.appendChild(headerRow);

    // Dati
    data.forEach(riga => {
        const row = document.createElement("tr");
        colonne.forEach(col => {
            const cell = document.createElement("td");
            cell.textContent = riga[col] || 'N/A';
            row.appendChild(cell);
        });
        
        // Aggiungi azioni per i libri
        if (idTabella === 'tabellaLibro') {
            const azioniCell = document.createElement("td");
            azioniCell.className = "azioni-cell";
            
            const btnModifica = document.createElement("button");
            btnModifica.textContent = "Modifica";
            btnModifica.className = "btn-azione btn-modifica";
            btnModifica.setAttribute("data-isbn", riga.codISBN);
            btnModifica.onclick = () => apriModaleModificaLibro(riga);
            
            const btnElimina = document.createElement("button");
            btnElimina.textContent = "Elimina";
            btnElimina.className = "btn-azione btn-elimina-tabella";
            btnElimina.setAttribute("data-isbn", riga.codISBN);
            btnElimina.onclick = () => eliminaLibro(riga.codISBN);
            
            azioniCell.appendChild(btnModifica);
            azioniCell.appendChild(btnElimina);
            row.appendChild(azioniCell);
        }
        
        tabella.appendChild(row);
    });

    tabella.style.display = "table";
}

function caricaTabellaRegione() {
    if (regioniData.length === 0) {
        fetch('php/get_regioni.php')
            .then(res => res.json())
            .then(data => {
                regioniData = data; // Salva i dati
                mostraTabella(data, ['cod', 'nome'], 'tabellaRegione');
            })
            .catch(err => console.error("Errore caricamento Regione:", err));
    } else {
        mostraTabella(regioniData, ['cod', 'nome'], 'tabellaRegione');
    }
}

// Carica Ricette
function caricaTabellaRicetta() {
  caricaRegioniPerRicette();
  caricaLibriPerRicette(); // Carica i libri per il dropdown
  
  if (ricetteData.length === 0) {
    fetch('php/get_ricette.php')
      .then(res => res.json())
      .then(data => {
        ricetteData = data;
        mostraTabella(data, ['numero', 'tipo', 'titolo', 'regioni', 'numeroLibri', 'titoliLibri'], 'tabellaRicetta');
      })
      .catch(err => console.error("Errore caricamento Ricette:", err));
  } else {
    mostraTabella(ricetteData, ['numero', 'tipo', 'titolo', 'regioni', 'numeroLibri', 'titoliLibri'], 'tabellaRicetta');
  }
}

// Carica Libri
function caricaTabellaLibro() {
    // Assicurati che la tabella sia visibile
    document.getElementById('tabellaLibro').style.display = 'table';
    
    if (libriData.length === 0) {
        fetch('php/get_libri.php')
            .then(res => res.json())
            .then(data => {
                libriData = data;
                mostraTabella(data, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
            })
            .catch(err => console.error("Errore caricamento Libri:", err));
    } else {
        mostraTabella(libriData, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
    }
}


// Funzione per filtrare le regioni
function filtraRegioni() {
    const filtro = document.getElementById('filtroRegione').value.toLowerCase();
    const regioniFiltrate = regioniData.filter(regione => 
        regione.nome.toLowerCase().includes(filtro)
    );
    mostraTabella(regioniFiltrate, ['cod', 'nome'], 'tabellaRegione');
}

function caricaRegioniPerRicette() {
    // Se abbiamo già i dati delle regioni, popoliamo subito il dropdown
    if (regioniData.length > 0) {
        popolaDropdownRegioni();
        return;
    }

    // Altrimenti carichiamo i dati
    fetch('php/get_regioni.php')
        .then(res => res.json())
        .then(data => {
            regioniData = data;
            popolaDropdownRegioni();
        })
        .catch(err => console.error("Errore caricamento Regioni:", err));
}

function popolaDropdownRegioni() {
    const select = document.getElementById('filtroRegioneRicetta');
    
    // Mantieni l'opzione "Tutte le regioni"
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    regioniData.forEach(regione => {
        const option = document.createElement('option');
        option.value = regione.nome;
        option.textContent = regione.nome;
        select.appendChild(option);
    });
}
// Funzione per caricare i libri
function caricaLibriPerRicette() {
    if (libriData.length > 0) {
        popolaDropdownLibri();
        return;
    }

    fetch('php/get_libri.php')
        .then(res => res.json())
        .then(data => {
            libriData = data;
            popolaDropdownLibri();
        })
        .catch(err => console.error("Errore caricamento Libri:", err));
}
// Popola il dropdown dei libri
function popolaDropdownLibri() {
    const select = document.getElementById('filtroLibro');
    // Mantieni l'opzione "Tutti i libri"
    while (select.options.length > 1) {
        select.remove(1);
    }

    libriData.forEach(libro => {
        const option = document.createElement('option');
        option.value = libro.titolo;
        option.textContent = libro.titolo;
        select.appendChild(option);
    });
}
// Funzione di filtraggio per le ricette
function filtraRicette() {
    const titolo = document.getElementById('filtroTitolo').value.toLowerCase();
    const tipo = document.getElementById('filtroTipo').value;
    const regione = document.getElementById('filtroRegioneRicetta').value;
    const minLibri = parseInt(document.getElementById('filtroMinLibri').value) || 0;
    const maxLibri = parseInt(document.getElementById('filtroMaxLibri').value) || Infinity;
    const libroSelezionato = document.getElementById('filtroLibro').value;

    const ricetteFiltrate = ricetteData.filter(ricetta => {
        const matchTitolo = ricetta.titolo.toLowerCase().includes(titolo);
        const matchTipo = tipo === '' || ricetta.tipo === tipo;
        const matchRegione = regione === '' || 
                            (ricetta.regioni && ricetta.regioni.toLowerCase().includes(regione.toLowerCase()));
        const matchNumeroLibri = ricetta.numeroLibri >= minLibri && ricetta.numeroLibri <= maxLibri;
        const matchLibro = libroSelezionato === '' || 
                          (ricetta.titoliLibri && ricetta.titoliLibri.toLowerCase().includes(libroSelezionato.toLowerCase()));

        return matchTitolo && matchTipo && matchRegione && matchNumeroLibri && matchLibro;
    });

   mostraTabella(ricetteFiltrate, ['numero', 'tipo', 'titolo', 'regioni', 'numeroLibri', 'titoliLibri'], 'tabellaRicetta');
}

function filtraLibri() {
    const isbn = document.getElementById('filtroISBN').value.toLowerCase();
    const titolo = document.getElementById('filtroTitoloLibro').value.toLowerCase();
    
    // Gestione dropdown anni
    const minAnnoSelect = document.getElementById('filtroMinAnno');
    const minAnno = minAnnoSelect.value ? parseInt(minAnnoSelect.value) : 0;
    const maxAnnoSelect = document.getElementById('filtroMaxAnno');
    const maxAnno = maxAnnoSelect.value ? parseInt(maxAnnoSelect.value) : Infinity;
    
    const minPagine = parseInt(document.getElementById('filtroMinPagine').value) || 0;
    const maxPagine = parseInt(document.getElementById('filtroMaxPagine').value) || Infinity;
    const minRicette = parseInt(document.getElementById('filtroMinRicette').value) || 0;
    const maxRicette = parseInt(document.getElementById('filtroMaxRicette').value) || Infinity;

    const libriFiltrati = libriData.filter(libro => {
        const matchISBN = isbn === '' || (libro.codISBN && libro.codISBN.toLowerCase().includes(isbn));
        const matchTitolo = titolo === '' || (libro.titolo && libro.titolo.toLowerCase().includes(titolo));
        const matchAnno = (minAnno === 0 || libro.anno >= minAnno) && 
                         (maxAnno === Infinity || libro.anno <= maxAnno);
        const matchPagine = (libro.numeroPagine >= minPagine) && (libro.numeroPagine <= maxPagine);
        const matchRicette = (libro.numeroRicette >= minRicette) && (libro.numeroRicette <= maxRicette);

        return matchISBN && matchTitolo && matchAnno && matchPagine && matchRicette;
    });

    mostraTabella(libriFiltrati, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
}

// Funzione per estrarre gli anni unici dai dati dei libri
function estraiAnniUnici(libri) {
    const anni = new Set();
    libri.forEach(libro => {
        if (libro.anno) {
            anni.add(libro.anno);
        }
    });
    return Array.from(anni).sort((a, b) => b - a); // Ordina dal più recente
}

// Popola i dropdown degli anni
function popolaDropdownAnni() {
    const anni = estraiAnniUnici(libriData);
    const minAnnoSelect = document.getElementById('filtroMinAnno');
    const maxAnnoSelect = document.getElementById('filtroMaxAnno');
    
    // Popola minAnnoSelect
    anni.forEach(anno => {
        const option = document.createElement('option');
        option.value = anno;
        option.textContent = anno;
        minAnnoSelect.appendChild(option);
    });
    
    // Popola maxAnnoSelect (stessi valori)
    anni.forEach(anno => {
        const option = document.createElement('option');
        option.value = anno;
        option.textContent = anno;
        maxAnnoSelect.appendChild(option);
    });
}

// Funzione per resettare i filtri
function resettaFiltriLibri() {
    document.getElementById('filtroISBN').value = '';
    document.getElementById('filtroTitoloLibro').value = '';
    document.getElementById('filtroMinAnno').value = '';
    document.getElementById('filtroMaxAnno').value = '';
    document.getElementById('filtroMinPagine').value = '';
    document.getElementById('filtroMaxPagine').value = '';
    document.getElementById('filtroMinRicette').value = '';
    document.getElementById('filtroMaxRicette').value = '';
    
    filtraLibri(); // Applica il reset
}

// Funzione per resettare i filtri delle ricette
function resettaFiltriRicette() {
    // Resetta tutti i campi di input
    document.getElementById('filtroTitolo').value = '';
    document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroRegioneRicetta').value = '';
    document.getElementById('filtroMinLibri').value = '';
    document.getElementById('filtroMaxLibri').value = '';
    document.getElementById('filtroLibro').value = '';
    
    // Ri-applica il filtro (mostra tutti i risultati)
    filtraRicette();
}

// Funzione per aprire il modale di modifica libro
function apriModaleModificaLibro(libro) {
    document.getElementById('modaleISBN').value = libro.codISBN;
    document.getElementById('modaleTitolo').value = libro.titolo;
    document.getElementById('modaleAnno').value = libro.anno;
    
    // Configura l'evento di eliminazione
    document.getElementById('btnEliminaLibro').onclick = () => {
        if (confirm(`Sei sicuro di voler eliminare il libro "${libro.titolo}"?`)) {
            eliminaLibro(libro.codISBN);
            document.getElementById('modaleModificaLibro').style.display = 'none';
        }
    };
    
    document.getElementById('modaleModificaLibro').style.display = 'block';
}
// Funzione per eliminare un libro
function eliminaLibro(isbn) {
    fetch(`php/elimina_libro.php?isbn=${isbn}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Rimuovi il libro dai dati locali
            libriData = libriData.filter(libro => libro.codISBN !== isbn);
            
            // Aggiorna la tabella
            mostraTabella(libriData, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
            
            alert('Libro eliminato con successo!');
        } else {
            alert('Errore durante l\'eliminazione: ' + data.message);
        }
    })
    .catch(err => {
        console.error("Errore eliminazione libro:", err);
        alert('Si è verificato un errore durante l\'eliminazione');
    });
}
// Funzione per salvare le modifiche a un libro
function salvaModificheLibro(e) {
    e.preventDefault();
    
    const isbn = document.getElementById('modaleISBN').value;
    const titolo = document.getElementById('modaleTitolo').value;
    const anno = document.getElementById('modaleAnno').value;
    
    fetch('php/modifica_libro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isbn, titolo, anno }) // Rimuovi pagine
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const libroIndex = libriData.findIndex(l => l.codISBN === isbn);
            if (libroIndex !== -1) {
                libriData[libroIndex].titolo = titolo;
                libriData[libroIndex].anno = anno;
                // Non modificare numeroPagine e numeroRicette
                mostraTabella(libriData, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
            }
            
            document.getElementById('modaleModificaLibro').style.display = 'none';
            alert('Modifiche salvate con successo!');
        } else {
            alert('Errore durante il salvataggio: ' + data.message);
        }
    })
    .catch(err => {
        console.error("Errore modifica libro:", err);
        alert('Si è verificato un errore durante il salvataggio');
    });
}

// Inizializzazione degli eventi
document.addEventListener('DOMContentLoaded', function() {
    // Gestione chiusura modale
    document.querySelector('.chiudi').addEventListener('click', function() {
        document.getElementById('modaleModificaLibro').style.display = 'none';
    });
    
    // Gestione submit form modifica
    document.getElementById('formModificaLibro').addEventListener('submit', salvaModificheLibro);
    
    // Chiusura modale cliccando fuori dal contenuto
    window.addEventListener('click', function(event) {
        const modale = document.getElementById('modaleModificaLibro');
        if (event.target === modale) {
            modale.style.display = 'none';
        }
    });
});

function mostraHome() {
    nascondiTutto();
    const gruppi = document.querySelectorAll('.options-group');
    gruppi.forEach(gruppo => {
        gruppo.style.display = 'none';
    });
}

function mostraLibri() {
    nascondiTutto();
    document.getElementById('tabella-container').style.display = 'block';
    caricaTabellaLibro();
    document.getElementById('opzioni3').style.display = 'block';
}


function mostraRicette() {
    nascondiTutto();
    document.getElementById('tabella-container').style.display = 'block';
    caricaTabellaRicetta();
    document.getElementById('opzioni2').style.display = 'block';
}

function mostraFormLibro() {
    nascondiTutto();
    document.getElementById('form-libro-container').style.display = 'block';
    document.getElementById('nuovoISBN').focus();

    const gruppi = document.querySelectorAll('.options-group');
    gruppi.forEach(gruppo => {
        gruppo.style.display = 'none';
    });
}

function nascondiTutto() {
    document.getElementById('tabella-container').style.display = 'none';
    document.getElementById('form-libro-container').style.display = 'none';
    
    // Nascondi tutte le tabelle
    document.querySelectorAll('.tabella').forEach(tab => {
        tab.style.display = 'none';
    });
}

function annullaInserimento() {
    document.getElementById('formNuovoLibro').reset();
    mostraLibri();
}

// Gestione submit form nuovo libro
document.getElementById('formNuovoLibro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isbn = document.getElementById('nuovoISBN').value;
    const titolo = document.getElementById('nuovoTitolo').value;
    const anno = document.getElementById('nuovoAnno').value;
    
    // Non inviare il campo pagine
    fetch('php/inserisci_libro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isbn, titolo, anno }) // Rimuovi pagine
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Libro inserito con successo!');
            document.getElementById('formNuovoLibro').reset();
            
            // Aggiorna i dati locali
            const nuovoLibro = {
                codISBN: isbn,
                titolo: titolo,
                anno: anno,
                numeroPagine: 0, // Verrà calcolato dal server
                numeroRicette: 0
            };
            
            libriData.push(nuovoLibro);
            mostraLibri();
        } else {
            alert('Errore: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Errore:', err);
        alert('Si è verificato un errore durante l\'inserimento');
    });
});