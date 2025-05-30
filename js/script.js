// Variabili globali per memorizzare i dati
let regioniData = [];
let ricetteData = [];
let libriData = [];

// Funzioni di inizializzazione e gestione UI
function mostraOpzioni(id) {
    // Nascondi tutti i gruppi di opzioni
    document.querySelectorAll('.options-group').forEach(gruppo => {
        gruppo.style.display = 'none';
    });

    // Mostra il gruppo selezionato
    document.getElementById(id).style.display = 'block';
    document.getElementById('tabella-container').style.display = 'block';
    document.getElementById('form-libro-container').style.display = 'none';

    // Nascondi tutte le tabelle
    document.querySelectorAll('table').forEach(tabella => {
        tabella.style.display = 'none';
    });

    // Carica la tabella appropriata
    switch(id) {
        case 'opzioni1': caricaTabellaRegione(); break;
        case 'opzioni2': caricaTabellaRicetta(); break;
        case 'opzioni3': caricaTabellaLibro(); break;
    }
}

function nascondiTutto() {
    document.getElementById('tabella-container').style.display = 'none';
    document.getElementById('form-libro-container').style.display = 'none';
    document.querySelectorAll('.tabella').forEach(tab => tab.style.display = 'none');
}

function mostraHome() {
    nascondiTutto();
    document.querySelectorAll('.options-group').forEach(gruppo => gruppo.style.display = 'none');
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
    document.querySelectorAll('.options-group').forEach(gruppo => gruppo.style.display = 'none');
}

function annullaInserimento() {
    document.getElementById('formNuovoLibro').reset();
    mostraLibri();
}

// Funzioni per la gestione delle tabelle
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

    // Aggiungi colonna azioni per la tabella libri
    if (idTabella === 'tabellaLibro') {
        const azioniHeader = document.createElement("th");
        azioniHeader.textContent = "Azioni";
        headerRow.appendChild(azioniHeader);
    }

    tabella.appendChild(headerRow);

    // Popola i dati
    data.forEach(riga => {
        const row = document.createElement("tr");
        
        colonne.forEach(col => {
            const cell = document.createElement("td");
            cell.textContent = riga[col] || 'N/A';
            row.appendChild(cell);
        });

        // Aggiungi pulsanti azione per i libri
        if (idTabella === 'tabellaLibro') {
            const azioniCell = document.createElement("td");
            azioniCell.className = "azioni-cell";
            
            const btnModifica = document.createElement("button");
            btnModifica.textContent = "Modifica";
            btnModifica.className = "btn-azione btn-modifica";
            btnModifica.onclick = () => apriModaleModificaLibro(riga);
            
            const btnElimina = document.createElement("button");
            btnElimina.textContent = "Elimina";
            btnElimina.className = "btn-azione btn-elimina-tabella";
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
                regioniData = data;
                mostraTabella(data, ['cod', 'nome'], 'tabellaRegione');
            })
            .catch(err => console.error("Errore caricamento Regioni:", err));
    } else {
        mostraTabella(regioniData, ['cod', 'nome'], 'tabellaRegione');
    }
}

function caricaTabellaRicetta() {
    caricaRegioniPerRicette();
    caricaLibriPerRicette();
    
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

function caricaTabellaLibro() {
    document.getElementById('tabellaLibro').style.display = 'table';
    
    if (libriData.length === 0) {
        fetch('php/get_libri.php')
            .then(res => res.json())
            .then(data => {
                libriData = data;
                mostraTabella(data, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
                popolaDropdownAnni();
            })
            .catch(err => console.error("Errore caricamento Libri:", err));
    } else {
        mostraTabella(libriData, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
        popolaDropdownAnni();
    }
}

// Funzioni per i dropdown
function popolaDropdownRegioni() {
    const select = document.getElementById('filtroRegioneRicetta');
    while (select.options.length > 1) select.remove(1);
    
    regioniData.forEach(regione => {
        const option = document.createElement('option');
        option.value = regione.nome;
        option.textContent = regione.nome;
        select.appendChild(option);
    });
}

function popolaDropdownLibri() {
    const select = document.getElementById('filtroLibro');
    while (select.options.length > 1) select.remove(1);
    
    libriData.forEach(libro => {
        const option = document.createElement('option');
        option.value = libro.titolo;
        option.textContent = libro.titolo;
        select.appendChild(option);
    });
}

function popolaDropdownAnni() {
    const anni = estraiAnniUnici(libriData);
    const minAnnoSelect = document.getElementById('filtroMinAnno');
    const maxAnnoSelect = document.getElementById('filtroMaxAnno');
    
    while (minAnnoSelect.options.length > 1) minAnnoSelect.remove(1);
    while (maxAnnoSelect.options.length > 1) maxAnnoSelect.remove(1);
    
    anni.forEach(anno => {
        const option = document.createElement('option');
        option.value = anno;
        option.textContent = anno;
        minAnnoSelect.appendChild(option);
        maxAnnoSelect.appendChild(option.cloneNode(true));
    });
}

function caricaRegioniPerRicette() {
    if (regioniData.length > 0) return popolaDropdownRegioni();
    
    fetch('php/get_regioni.php')
        .then(res => res.json())
        .then(data => {
            regioniData = data;
            popolaDropdownRegioni();
        })
        .catch(err => console.error("Errore caricamento Regioni:", err));
}

function caricaLibriPerRicette() {
    if (libriData.length > 0) return popolaDropdownLibri();
    
    fetch('php/get_libri.php')
        .then(res => res.json())
        .then(data => {
            libriData = data;
            popolaDropdownLibri();
        })
        .catch(err => console.error("Errore caricamento Libri:", err));
}

// Funzioni di filtraggio
function filtraRegioni() {
    const filtro = document.getElementById('filtroRegione').value.toLowerCase();
    const regioniFiltrate = regioniData.filter(regione => 
        regione.nome.toLowerCase().includes(filtro)
    );
    mostraTabella(regioniFiltrate, ['cod', 'nome'], 'tabellaRegione');
}

function filtraRicette() {
    const titolo = document.getElementById('filtroTitolo').value.toLowerCase();
    const tipo = document.getElementById('filtroTipo').value;
    const regione = document.getElementById('filtroRegioneRicetta').value;
    const minLibri = parseInt(document.getElementById('filtroMinLibri').value) || 0;
    const maxLibri = parseInt(document.getElementById('filtroMaxLibri').value) || Infinity;
    const libroSelezionato = document.getElementById('filtroLibro').value;

    const ricetteFiltrate = ricetteData.filter(ricetta => {
        return ricetta.titolo.toLowerCase().includes(titolo) &&
               (tipo === '' || ricetta.tipo === tipo) &&
               (regione === '' || ricetta.regioni?.toLowerCase().includes(regione.toLowerCase())) &&
               ricetta.numeroLibri >= minLibri && ricetta.numeroLibri <= maxLibri &&
               (libroSelezionato === '' || ricetta.titoliLibri?.toLowerCase().includes(libroSelezionato.toLowerCase()));
    });

    mostraTabella(ricetteFiltrate, ['numero', 'tipo', 'titolo', 'regioni', 'numeroLibri', 'titoliLibri'], 'tabellaRicetta');
}

function filtraLibri() {
    const isbn = document.getElementById('filtroISBN').value.toLowerCase();
    const titolo = document.getElementById('filtroTitoloLibro').value.toLowerCase();
    const minAnno = parseInt(document.getElementById('filtroMinAnno').value) || 0;
    const maxAnno = parseInt(document.getElementById('filtroMaxAnno').value) || Infinity;
    const minPagine = parseInt(document.getElementById('filtroMinPagine').value) || 0;
    const maxPagine = parseInt(document.getElementById('filtroMaxPagine').value) || Infinity;
    const minRicette = parseInt(document.getElementById('filtroMinRicette').value) || 0;
    const maxRicette = parseInt(document.getElementById('filtroMaxRicette').value) || Infinity;

    const libriFiltrati = libriData.filter(libro => {
        return (isbn === '' || libro.codISBN?.toLowerCase().includes(isbn)) &&
               (titolo === '' || libro.titolo?.toLowerCase().includes(titolo)) &&
               libro.anno >= minAnno && libro.anno <= maxAnno &&
               libro.numeroPagine >= minPagine && libro.numeroPagine <= maxPagine &&
               libro.numeroRicette >= minRicette && libro.numeroRicette <= maxRicette;
    });

    mostraTabella(libriFiltrati, ['codISBN', 'titolo', 'anno', 'numeroPagine', 'numeroRicette'], 'tabellaLibro');
}

// Funzioni di supporto
function estraiAnniUnici(libri) {
    const anni = new Set();
    libri.forEach(libro => libro.anno && anni.add(libro.anno));
    return Array.from(anni).sort((a, b) => b - a);
}

function resettaFiltriLibri() {
    document.getElementById('filtroISBN').value = '';
    document.getElementById('filtroTitoloLibro').value = '';
    document.getElementById('filtroMinAnno').value = '';
    document.getElementById('filtroMaxAnno').value = '';
    document.getElementById('filtroMinPagine').value = '';
    document.getElementById('filtroMaxPagine').value = '';
    document.getElementById('filtroMinRicette').value = '';
    document.getElementById('filtroMaxRicette').value = '';
    filtraLibri();
}

function resettaFiltriRicette() {
    document.getElementById('filtroTitolo').value = '';
    document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroRegioneRicetta').value = '';
    document.getElementById('filtroMinLibri').value = '';
    document.getElementById('filtroMaxLibri').value = '';
    document.getElementById('filtroLibro').value = '';
    filtraRicette();
}

// Funzioni per la gestione dei libri
function apriModaleModificaLibro(libro) {
    document.getElementById('modaleISBN').value = libro.codISBN;
    document.getElementById('modaleTitolo').value = libro.titolo;
    document.getElementById('modaleAnno').value = libro.anno;
    
    document.getElementById('btnEliminaLibro').onclick = () => {
        if (confirm(`Sei sicuro di voler eliminare il libro "${libro.titolo}"?`)) {
            eliminaLibro(libro.codISBN);
            document.getElementById('modaleModificaLibro').style.display = 'none';
        }
    };
    
    document.getElementById('modaleModificaLibro').style.display = 'block';
}

function eliminaLibro(isbn) {
    fetch(`php/elimina_libro.php?isbn=${isbn}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                libriData = libriData.filter(libro => libro.codISBN !== isbn);
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

function salvaModificheLibro(e) {
    e.preventDefault();
    
    const isbn = document.getElementById('modaleISBN').value;
    const titolo = document.getElementById('modaleTitolo').value;
    const anno = document.getElementById('modaleAnno').value;
    
    fetch('php/modifica_libro.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isbn, titolo, anno })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const libroIndex = libriData.findIndex(l => l.codISBN === isbn);
            if (libroIndex !== -1) {
                libriData[libroIndex].titolo = titolo;
                libriData[libroIndex].anno = anno;
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

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    mostraHome();
    
    // Gestione selezione radio buttons
    document.querySelectorAll('input[name="scelta"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const opzioneId = 'opzioni' + this.value.slice(-1);
            mostraOpzioni(opzioneId);
            
            switch(this.value) {
                case 'opzione1': caricaTabellaRegione(); break;
                case 'opzione2': caricaTabellaRicetta(); break;
                case 'opzione3': caricaTabellaLibro(); break;
            }
        });
    });

    // Gestione modale
    document.querySelector('.chiudi').addEventListener('click', () => {
        document.getElementById('modaleModificaLibro').style.display = 'none';
    });
    
    document.getElementById('formModificaLibro').addEventListener('submit', salvaModificheLibro);
    
    window.addEventListener('click', (event) => {
        const modale = document.getElementById('modaleModificaLibro');
        if (event.target === modale) modale.style.display = 'none';
    });

    // Gestione form nuovo libro
    document.getElementById('formNuovoLibro').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isbn = document.getElementById('nuovoISBN').value;
        const titolo = document.getElementById('nuovoTitolo').value;
        const anno = document.getElementById('nuovoAnno').value;
        
        fetch('php/inserisci_libro.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn, titolo, anno })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Libro inserito con successo!');
                document.getElementById('formNuovoLibro').reset();
                
                libriData.push({
                    codISBN: isbn,
                    titolo: titolo,
                    anno: anno,
                    numeroPagine: 0,
                    numeroRicette: 0
                });
                
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
});