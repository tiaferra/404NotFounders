function mostraOpzioni(id) {
  const gruppi = document.querySelectorAll('.options-group');
  const tabelle = document.querySelectorAll('.tabella');

  // Nasconde tutti i gruppi di opzioni
  gruppi.forEach(gruppo => {
    gruppo.style.display = 'none';
  });

  // Nasconde tutte le tabelle
  tabelle.forEach(tabella => {
    tabella.style.display = 'none';
  });

  // Mostra solo il gruppo selezionato
  document.getElementById(id).style.display = 'block';

  // Mostra la tabella corrispondente
  if (id === 'opzioni1') {
    document.getElementById('tabella1').style.display = 'block';
  } else if (id === 'opzioni2') {
    document.getElementById('tabella2').style.display = 'block';
  } else if (id === 'opzioni3') {
    document.getElementById('tabella3').style.display = 'block';
  }
}
