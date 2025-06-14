// Variabili globali per memorizzare i dati
let regioniData = [];
let ricetteData = [];
let libriData = [];
let navigationStack = [];
let sortDirection = {}; // memorizza la direzione per ogni tabella/colonna



// Funzioni di inizializzazione e gestione UI
function mostraOpzioni(id) {
    nascondiTutto();
    navigationStack = [];
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
    document.getElementById('form-libro-container').style.display = 'none';
    document.getElementById('tabella-container').style.display = 'none';
    document.getElementById('home-container').style.display = 'none';
    document.querySelectorAll('.tabella').forEach(tab => tab.style.display = 'none');
}

function mostraHome() {
    nascondiTutto();
    document.getElementById('home-container').style.display = 'block';
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
function mostraTabella(data, colonne, idTabella, colonneNascondi = []) {
    const tabella = document.getElementById(idTabella);
    tabella.innerHTML = "";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Etichette intestazione
    const headerLabelsPerTabella = {
        tabellaRegione: {
            nome: "Nome Regione",
            NumeroRicette: "Ricette Regionali"
        },
        tabellaLibro: {
            codISBN: "ISBN",
            titolo: "Titolo del Libro",
            anno: "Anno di Pubblicazione"
        },
        tabellaRicetta: {
            numero: "Numero",
            titolo: "Nome del Piatto",
            tipo: "Tipologia di Portata",
            regioni: "Regioni",
            numeroLibri: "N° Libri",
            titoliLibri: "Libri Associati"
        }
    };

    const labels = headerLabelsPerTabella[idTabella] || {};

    let colIndexVisible = 0;
    colonne.forEach((col, index) => {
        if (colonneNascondi.includes(col)) return;
        const currentIndex = colIndexVisible;

        const th = document.createElement("th");
        th.style.cursor = "pointer";
        const defaultIcon = (colIndexVisible === 0) ? ' ▲' : '';
        th.innerHTML = `${labels[col] || col} <span class="sort-icon">${defaultIcon}</span>`;
        th.addEventListener("click", () => {
            const tipo = col.toLowerCase().includes("anno") || col.toLowerCase().includes("numero") ? "numero" : "stringa";
            ordinaTabellaDinamica(idTabella, currentIndex, tipo);
        });
        headerRow.appendChild(th);
        colIndexVisible++;
    });

    // Colonna Azioni
    const azioniTh = document.createElement("th");
    azioniTh.textContent = "Azioni";
    headerRow.appendChild(azioniTh);

    thead.appendChild(headerRow);
    tabella.appendChild(thead);

    const tbody = document.createElement("tbody");

    data.forEach(riga => {
        const row = document.createElement("tr");

        colonne.forEach(col => {
            if (colonneNascondi.includes(col)) return;

            const cell = document.createElement("td");
            const valore = riga[col] || 'N/A';

            if (col === 'titolo' || col === 'nome') {
                const link = document.createElement("a");
                link.href = "#";
                link.textContent = valore;
                link.onclick = (e) => {
                    e.preventDefault();
                    if (idTabella === 'tabellaLibro') {
                        mostraDettaglioLibro(riga);
                    } else if (idTabella === 'tabellaRegione') {
                        mostraDettaglioRegione(riga);
                    } else if (idTabella === 'tabellaRicetta') {
                        mostraDettaglioRicetta(riga);
                    }
                };
                cell.appendChild(link);
            } else {
                cell.textContent = valore;
            }

            row.appendChild(cell);
        });

        // Colonna Azioni
        const azioniCell = document.createElement("td");
        const btnDettagli = document.createElement("button");
        btnDettagli.textContent = "Dettagli";
        btnDettagli.className = "btn-azione btn-view";

        if (idTabella === 'tabellaLibro') {
            btnDettagli.onclick = () => mostraDettaglioLibro(riga);
        } else if (idTabella === 'tabellaRegione') {
            btnDettagli.onclick = () => mostraDettaglioRegione(riga);
        } else if (idTabella === 'tabellaRicetta') {
            btnDettagli.onclick = () => mostraDettaglioRicetta(riga);
        }

        azioniCell.appendChild(btnDettagli);
        row.appendChild(azioniCell);

        tbody.appendChild(row);
    });

    tabella.appendChild(tbody);
    tabella.style.display = "table";
}



function caricaTabellaRegione() {
    if (regioniData.length === 0) {
        fetch('php/get_regioni.php')
            .then(res => res.json())
            .then(data => {
                regioniData = data;
                mostraTabella(data, ['nome', 'NumeroRicette'], 'tabellaRegione');
            })
            .catch(err => console.error("Errore caricamento Regioni:", err));
    } else {
        mostraTabella(regioniData, ['nome', 'NumeroRicette'], 'tabellaRegione');
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
                mostraTabella( data, ['numero', 'titolo', 'tipo', 'regioni', 'numeroLibri', 'titoliLibri'], 'tabellaRicetta', ['numero', 'regioni', 'numeroLibri', 'titoliLibri'] // colonne da nascondere
);
            })
            .catch(err => console.error("Errore caricamento Ricette:", err));
    } else {
        mostraTabella(
    ricetteData,
    ['numero', 'titolo', 'tipo', 'regioni', 'numeroLibri', 'titoliLibri'],
    'tabellaRicetta',
    ['numero', 'regioni', 'numeroLibri', 'titoliLibri'] // colonne da nascondere
);
    }
}

function caricaTabellaLibro() {
    document.getElementById('tabellaLibro').style.display = 'table';
    
    if (libriData.length === 0) {
        fetch('php/get_libri.php')
            .then(res => res.json())
            .then(data => {
                libriData = data;
                mostraTabella(data, ['codISBN', 'titolo', 'anno'], 'tabellaLibro');
                popolaDropdownAnni();
            })
            .catch(err => console.error("Errore caricamento Libri:", err));
    } else {
        mostraTabella(libriData, ['codISBN', 'titolo', 'anno'], 'tabellaLibro');
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
                chiudiModaleLibro();
                document.getElementById('modaleModificaLibro').style.display = 'none';
            } else {
                alert('Errore durante l\'eliminazione: ' + data.message);
            }
        })
        .catch(err => {
            console.error("Errore eliminazione libro:", err);
            alert('Si ÃƒÂ¨ verificato un errore durante l\'eliminazione');
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
                mostraTabella(libriData, ['codISBN', 'titolo', 'anno'/*, 'numeroPagine', 'numeroRicette'*/], 'tabellaLibro');
            }
            document.getElementById('modaleModificaLibro').style.display = 'none';
            mostraNotifica('Modifiche salvate con successo!');
        } else {
            mostraNotifica('Errore: ' + data.message, 'errore');
        }
    })
    .catch(err => {
       mostraNotifica('Si è verificato un errore', 'errore');
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
        const modaleRegione = document.getElementById('modaleDettaglioRegione');
        if (event.target === modaleRegione) {
            chiudiModaleRegione();
        }
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
            alert('Si ÃƒÂ¨ verificato un errore durante l\'inserimento');
        });
    });

    // Aggiunta pulsante "Indietro"
    const backButton = document.createElement('button');
    backButton.className = 'nav-button';
    backButton.textContent = '← Indietro';
    backButton.onclick = navigaIndietro;
    backButton.style.display = 'none';
    backButton.id = 'backButton';
    
    document.querySelector('.nav').prepend(backButton);
    
    // Mostra/nascondi pulsante "Indietro" in base allo stack
    const observer = new MutationObserver(() => {
        backButton.style.display = navigationStack.length > 0 ? 'block' : 'none';
    });
    observer.observe(backButton, { attributes: true });
});
function mostraDettaglioRicetta(ricetta) {
    navigationStack.push({type: 'ricetta', data: ricetta});
    const contenuto = document.getElementById('dettaglio-ricetta-content');
    
    contenuto.innerHTML = `
        <div class="dettaglio-ricetta">
            <h3>${ricetta.titolo}</h3>
            
            <div class="dettaglio-sezione">
                <h4>Informazioni</h4>
                <p><strong>Tipo:</strong> ${ricetta.tipo}</p>
                <p><strong>Regioni:</strong> ${ricetta.regioni}</p>
                <p><strong>Numero libri:</strong> ${ricetta.numeroLibri}</p>
            </div>
            
            <div class="dettaglio-sezione">
                <h4>Ingredienti</h4>
                <p>Caricamento ingredienti...</p>
            </div>
            
            <div class="dettaglio-sezione" style="grid-column: 1 / -1;">
            <h4>Libri che contengono questa ricetta</h4>
            <ul class="libri-lista">
                ${ricetta.titoliLibri.split(', ').map(libro => 
                    `<li><a href="#" onclick="cercaEVisualizzaLibroPerTitolo('${libro.trim()}'); return false;">${libro}</a></li>`
                ).join('')}
            </ul>
        </div>
            
            <button class="nav-button" onclick="chiudiModaleRicetta()" style="grid-column: 1 / -1; margin-top: 15px;">
                Chiudi
            </button>
        </div>
    `;
    
    document.getElementById('modaleDettaglioRicetta').style.display = 'block';
    
    // Fetch ingredients (come prima)
    fetch(`php/get_ingredienti.php?numero=${ricetta.numero}`)
        .then(response => response.json())
        .then(ingredienti => {
            let ingredientiHtml = 'Dettagli ingredienti non disponibili';
            
            if (ingredienti.length > 0) {
                ingredientiHtml = ingredienti.map(ing => 
                    `${ing.ingrediente} - ${ing.quantità}`
                ).join('<br>');
            }
            
            const ingredientiElement = contenuto.querySelector('.dettaglio-sezione:nth-child(3) p');
            ingredientiElement.innerHTML = ingredientiHtml;
        })
        .catch(err => {
            console.error('Errore nel caricamento degli ingredienti:', err);
            const ingredientiElement = contenuto.querySelector('.dettaglio-sezione:nth-child(3) p');
            ingredientiElement.textContent = 'Errore nel caricamento degli ingredienti';
        });
}
function chiudiModaleRicetta() {
    document.getElementById('modaleDettaglioRicetta').style.display = 'none';
}
document.querySelectorAll('.chiudi').forEach(button => {
    button.addEventListener('click', chiudiModaleRicetta);
});

window.addEventListener('click', (event) => {
    const modaleRicetta = document.getElementById('modaleDettaglioRicetta');
    if (event.target === modaleRicetta) {
        chiudiModaleRicetta();
    }

    const modaleDettaglioLibro = document.getElementById('modaleDettaglioLibro');
    if (event.target === modaleDettaglioLibro) {
        chiudiModaleLibro();
    }

    const modaleRegione = document.getElementById('modaleDettaglioRegione');
    if (event.target === modaleRegione) {
        chiudiModaleRegione();
    }
});

function cercaLibroPerTitolo(titolo) {
    document.getElementById('filtroTitoloLibro').value = titolo;
    mostraOpzioni('opzioni3');
    caricaTabellaLibro();
    filtraLibri();
    chiudiModaleRicetta();
    
    // Scroll to the table
    document.getElementById('tabella-container').scrollIntoView();
}

function mostraDettaglioLibro(libro) {
    navigationStack.push({type: 'libro', data: libro});
    const contenuto = document.getElementById('dettaglio-libro-content');
    
    contenuto.innerHTML = `
        <div class="dettaglio-libro">
            <h3>${libro.titolo}</h3>
            <p><strong>ISBN:</strong> ${libro.codISBN}</p>
            <p><strong>Anno:</strong> ${libro.anno}</p>
            <p><strong>Pagine:</strong> ${libro.numeroPagine}</p>
            <p><strong>Ricette:</strong> ${libro.numeroRicette}</p>

            <div class="dettaglio-sezione">
                <h4>Ricette contenute</h4>
                <div id="ricette-libro">Caricamento ricette...</div>
            </div>
            
            <div class="form-azioni">
                <button class="nav-button" onclick="apriModaleModificaLibro(${JSON.stringify(libro).replace(/"/g, '&quot;')});chiudiModaleLibro()">Modifica</button>
                <button class="nav-button btn-elimina" onclick="eliminaLibro('${libro.codISBN}')">Elimina</button>
            </div>
        </div>
    `;
    
    document.getElementById('modaleDettaglioLibro').style.display = 'block';
    
    // Carica le ricette del libro
    fetch(`php/get_ricette_libro.php?isbn=${libro.codISBN}`)
        .then(response => response.json())
        .then(ricette => {
            let ricetteHtml = 'Nessuna ricetta presente.';
            if (ricette.length > 0) {
                ricetteHtml = '<ul class="ricette-lista">';
                ricette.forEach(ric => {
                    // Verifica che la ricetta abbia il campo numero
                    if (!ric.numero) {
                        console.error('Ricetta senza numero:', ric);
                    }
                    
                    ricetteHtml += `
                        <li>
                            <a href="#" class="ricetta-link" 
                               data-numero="${ric.numero || '0'}" 
                               data-titolo="${ric.titolo || ''}" 
                               data-tipo="${ric.tipo || ''}">
                                ${ric.titolo || 'Senza titolo'} (${ric.tipo || 'Sconosciuto'})
                            </a>
                        </li>`;
                });
                ricetteHtml += '</ul>';
            }
            document.getElementById('ricette-libro').innerHTML = ricetteHtml;
            
            // Aggiungi gestore eventi
            document.getElementById('ricette-libro').addEventListener('click', function(e) {
                if (e.target.classList.contains('ricetta-link')) {
                    e.preventDefault();
                    
                    // Crea l'oggetto ricetta con tutti i campi necessari
                    const ricetta = {
                        numero: e.target.getAttribute('data-numero'),
                        titolo: e.target.getAttribute('data-titolo'),
                        tipo: e.target.getAttribute('data-tipo'),
                        regioni: libro.regioni || '',
                        numeroLibri: libro.numeroRicette || 0,
                        titoliLibri: libro.titolo || ''
                    };
                    chiudiModaleLibro();
                    mostraDettaglioRicetta(ricetta);
                }
            });
        })
        .catch(err => {
            console.error('Errore nel caricamento delle ricette:', err);
            document.getElementById('ricette-libro').innerHTML = 'Errore nel caricamento delle ricette.';
        });
}


function chiudiModaleLibro() {
    document.getElementById('modaleDettaglioLibro').style.display = 'none';
}

function cercaLibroPerISBN(isbn) {
    const libro = libriData.find(l => l.codISBN === isbn);
    if (libro) {
        mostraDettaglioLibro(libro);
    } else {
        alert('Libro non trovato!');
    }
}

function mostraDettaglioRegione(regione) {
    navigationStack.push({type: 'regione', data: regione});
    const contenuto = document.getElementById('dettaglio-regione-content');
    
    contenuto.innerHTML = `
        <div class="dettaglio-regione">
            <h3>${regione.nome}</h3>
            <p><strong>Numero di ricette:</strong> ${regione.NumeroRicette}</p>

            <div class="dettaglio-sezione">
                <h4>Ricette</h4>
                <div id="ricette-regione">Caricamento ricette...</div>
            </div>
            
            <button class="nav-button" onclick="chiudiModaleRegione()" style="margin-top: 15px;">
                Chiudi
            </button>
        </div>
    `;
    
    document.getElementById('modaleDettaglioRegione').style.display = 'block';
    
    // Carica le ricette della regione
    fetch(`php/get_ricette_regione.php?codRegione=${regione.cod}`)
        .then(response => response.json())
        .then(ricette => {
            let ricetteHtml = 'Nessuna ricetta presente.';
            if (ricette.length > 0) {
                ricetteHtml = '<ul class="ricette-lista">';
                ricette.forEach(ric => {
                    // AGGIUNGIAMO UNA CHIAMATA PER OTTENERE I LIBRI PER OGNI RICETTA
                    ricetteHtml += `
                        <li>
        <a href="#" 
           onclick="caricaDettagliRicettaCompleti(${ric.numero}, '${ric.titolo.replace(/'/g, "\\'")}', '${ric.tipo.replace(/'/g, "\\'")}', '${regione.nome.replace(/'/g, "\\'")}'); return false;">
            ${ric.titolo} (${ric.tipo})
        </a>
    </li>`;

                });
                ricetteHtml += '</ul>';
            }
            document.getElementById('ricette-regione').innerHTML = ricetteHtml;
        })
        .catch(err => {
            console.error('Errore nel caricamento delle ricette:', err);
            document.getElementById('ricette-regione').innerHTML = 'Errore nel caricamento delle ricette.';
        });
}




// Nuova funzione per caricare i dettagli completi della ricetta
function caricaDettagliRicettaCompleti(numero, titolo, tipo, regioni) {
    chiudiModaleRegione();
    
    fetch(`php/get_ricetta_singola.php?numero=${numero}`)
        .then(response => response.json())
        .then(ricettaCompleta => {
             console.log("Risposta PHP get_ricetta_singola:", ricettaCompleta);
            if (ricettaCompleta.error) {
                // Fallback se la ricetta non viene trovata
                const ricetta = {
                    numero: numero,
                    titolo: titolo,
                    tipo: tipo,
                    regioni: regioni,
                    numeroLibri: 0,
                    titoliLibri: 'Dati non disponibili'
                };
                mostraDettaglioRicetta(ricetta);
            } else {
                mostraDettaglioRicetta(ricettaCompleta);
            }
        })
        .catch(err => {
            console.error('Errore nel caricamento dettagli ricetta:', err);
            // Fallback in caso di errore
            const ricetta = {
                numero: numero,
                titolo: titolo,
                tipo: tipo,
                regioni: regioni,
                numeroLibri: 0,
                titoliLibri: 'Dati non disponibili'
            };
            mostraDettaglioRicetta(ricetta);
        });
}
function chiudiModaleRegione() {
    document.getElementById('modaleDettaglioRegione').style.display = 'none';
}

function navigaIndietro() {
    if (navigationStack.length > 1) {
        navigationStack.pop(); // Rimuove lo stato corrente
        const prevState = navigationStack[navigationStack.length - 1];
        
        switch(prevState.type) {
            case 'ricetta':
                mostraDettaglioRicetta(prevState.data);
                break;
            case 'libro':
                mostraDettaglioLibro(prevState.data);
                break;
            case 'regione':
                mostraDettaglioRegione(prevState.data);
                break;
            default:
                mostraHome();
        }
    } else {
        mostraHome();
    }
}

function mostraNotifica(messaggio, tipo = 'successo') {
    const notifica = document.createElement('div');
    notifica.className = `notifica notifica-${tipo}`;
    notifica.textContent = messaggio;
    
    document.body.appendChild(notifica);
    
    setTimeout(() => {
        notifica.classList.add('mostra');
    }, 10);
    
    setTimeout(() => {
        notifica.classList.remove('mostra');
        setTimeout(() => {
            document.body.removeChild(notifica);
        }, 300);
    }, 3000);
}


function aggiornaBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    if (navigationStack.length > 0) {
        const items = navigationStack.map(item => {
            switch(item.type) {
                case 'ricetta': return 'Ricetta: ' + item.data.titolo;
                case 'libro': return 'Libro: ' + item.data.titolo;
                case 'regione': return 'Regione: ' + item.data.nome;
            }
        });
        breadcrumb.textContent = items.join(' → ');
    } else {
        breadcrumb.textContent = 'Home';
    }
}

navigationStack = new Proxy([], {
    set: function(target, property, value, receiver) {
        const result = Reflect.set(target, property, value, receiver);
        aggiornaBreadcrumb();
        return result;
    }
});

function cercaEVisualizzaLibroPerTitolo(titoloLibro) {
    const libro = libriData.find(l => l.titolo === titoloLibro);
    
    if (libro) {
        chiudiModaleRicetta();
        mostraDettaglioLibro(libro);
    } else {
        fetch(`php/cerca_libro_per_titolo.php?titolo=${encodeURIComponent(titoloLibro)}`)
            .then(response => response.json())
            .then(libro => {
                if (libro) {
                    chiudiModaleRicetta();
                    mostraDettaglioLibro(libro);
                } else {
                    alert('Libro non trovato!');
                }
            })
            .catch(err => console.error('Errore ricerca libro:', err));
    }
}

function ordinaTabellaDinamica(tabellaId, colIndex, tipo) {
    const tabella = document.getElementById(tabellaId);
    const tbody = tabella.querySelector("tbody");
    const righe = Array.from(tbody.rows);

    const chiaveSort = `${tabellaId}_${colIndex}`;
    sortDirection[chiaveSort] = !sortDirection[chiaveSort]; // toggle

    righe.sort((a, b) => {
        let valA = a.cells[colIndex].textContent.trim();
        let valB = b.cells[colIndex].textContent.trim();

        // Parsing per numeri
        if (tipo === "numero") {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        } else {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection[chiaveSort] ? -1 : 1;
        if (valA > valB) return sortDirection[chiaveSort] ? 1 : -1;
        return 0;
    });

    righe.forEach(r => tbody.appendChild(r));

    // Aggiorna le icone
    const ths = tabella.querySelectorAll("th");
    ths.forEach((th, i) => {
        const span = th.querySelector("span.sort-icon");
        if (span) span.textContent = (i === colIndex) ? (sortDirection[chiaveSort] ? " ▲" : " ▼") : "";
    });
}
