// Variabile globale per memorizzare i dati delle regioni
let regioniData = [];
let ricetteData = [];
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
    const tabella = document.getElementById(idTabella);
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
    data.forEach(riga => {
        const row = document.createElement("tr");
        colonne.forEach(col => {
            const cell = document.createElement("td");
            cell.textContent = riga[col];
            row.appendChild(cell);
        });
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
    if (ricetteData.length === 0) {
        // MODIFICA QUI: usa il nuovo endpoint che include le regioni
        fetch('php/get_ricette_con_regioni.php')
            .then(res => res.json())
            .then(data => {
                ricetteData = data;
                mostraTabella(data, ['numero', 'tipo', 'titolo'], 'tabellaRicetta');
                caricaRegioniPerRicette(); // Carica le regioni per il dropdown
            })
            .catch(err => console.error("Errore caricamento Ricette:", err));
    } else {
        mostraTabella(ricetteData, ['numero', 'tipo', 'titolo'], 'tabellaRicetta');
    }
}

// Carica Libri
function caricaTabellaLibro() {
  fetch('php/get_libri.php')
    .then(res => res.json())
    .then(data => {
      mostraTabella(data, ['codISBN', 'titolo', 'anno'], 'tabellaLibro');
    })
    .catch(err => console.error("Errore caricamento Libri:", err));
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
    if (regioniData.length === 0) {
        fetch('php/get_regioni.php')
            .then(res => res.json())
            .then(data => {
                regioniData = data;
                popolaDropdownRegioni();
            })
            .catch(err => console.error("Errore caricamento Regioni:", err));
    } else {
        popolaDropdownRegioni();
    }
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

// Funzione di filtraggio per le ricette
function filtraRicette() {
    const titolo = document.getElementById('filtroTitolo').value.toLowerCase();
    const tipo = document.getElementById('filtroTipo').value;
    const regione = document.getElementById('filtroRegioneRicetta').value;

    const ricetteFiltrate = ricetteData.filter(ricetta => {
        const matchTitolo = ricetta.titolo.toLowerCase().includes(titolo);
        const matchTipo = tipo === '' || ricetta.tipo === tipo;
        
        // MODIFICA QUI: usa il campo regioni
        const matchRegione = regione === '' || 
                             (ricetta.regioni && ricetta.regioni.toLowerCase().includes(regione.toLowerCase()));
        
        return matchTitolo && matchTipo && matchRegione;
    });

    mostraTabella(ricetteFiltrate, ['numero', 'tipo', 'titolo'], 'tabellaRicetta');
}