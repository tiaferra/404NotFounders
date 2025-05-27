// Mostra il gruppo di opzioni e nasconde le altre
function mostraOpzioni(id) {
  const gruppi = document.querySelectorAll('.options-group');
  gruppi.forEach(gruppo => {
    gruppo.style.display = 'none';
  });

  document.getElementById(id).style.display = 'block';

  // Nasconde tutte le tabelle quando si cambia opzione
  const tabelle = document.querySelectorAll('table');
  tabelle.forEach(tabella => tabella.style.display = 'none');
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
  // Nasconde tutte le tabelle prima di mostrare quella attuale
  const tabelle = document.querySelectorAll('table');
  tabelle.forEach(tabella => tabella.style.display = 'none');

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

// Carica Regione
function caricaTabellaRegione() {
  fetch('php/get_regioni.php')
    .then(res => res.json())
    .then(data => {
      mostraTabella(data, ['cod', 'nome'], 'tabellaRegione');
    })
    .catch(err => console.error("Errore caricamento Regione:", err));
}

// Carica Ricette
function caricaTabellaRicetta() {
  fetch('php/get_ricette.php')
    .then(res => res.json())
    .then(data => {
      mostraTabella(data, ['numero', 'tipo', 'titolo'], 'tabellaRicetta');
    })
    .catch(err => console.error("Errore caricamento Ricette:", err));
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
