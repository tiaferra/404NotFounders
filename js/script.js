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

    if (id === 'opzioni1') {
        caricaTabellaRegione();
    } else if (id === 'opzioni2') {
        caricaTabellaRicetta();
    } else if (id === 'opzioni3') {
        caricaTabellaLibro();
    }
}

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
    console.log("Mostra tabella:", idTabella, "con dati:", data); // Debug
    
    const tabella = document.getElementById(idTabella);
    if (!tabella) {
        console.error("Elemento tabella non trovato:", idTabella);
        return;
    }
    
    tabella.innerHTML = "";

    // Intestazione
    const headerRow = document.createElement("tr");
    colonne.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
    });
    tabella.appendChild(headerRow);

    // Dati
    if (data && data.length > 0) {
        data.forEach(riga => {
            const row = document.createElement("tr");
            colonne.forEach(col => {
                const cell = document.createElement("td");
                cell.textContent = riga[col] || 'N/A'; // Gestione valori nulli
                row.appendChild(cell);
            });
            tabella.appendChild(row);
        });
    } else {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = colonne.length;
        cell.textContent = "Nessun dato disponibile";
        row.appendChild(cell);
        tabella.appendChild(row);
    }

    tabella.style.display = "table";
    console.log("Tabella mostrata:", tabella); // Debug
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
  if (libriData.length === 0) {
    fetch('php/get_libri.php')
      .then(res => res.json())
      .then(data => {
        libriData = data;
        popolaDropdownAnni(); // Popola i dropdown degli anni
        mostraTabella(data, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
      })
      .catch(err => console.error("Errore caricamento Libri:", err));
  } else {
    popolaDropdownAnni(); // Popola i dropdown anche se i dati sono già in memoria
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