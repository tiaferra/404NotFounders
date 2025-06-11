<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ricettario - Gestione Libri</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js" defer></script>

</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">
                🥗 Ricettario 404
            </div>
        </div>
    </header>

 
   <main class="main">
        <div class="box sfondo">
            <div class="box">
                <div id="opzioni1" class="options-group">
                    <h3>Filtra per nome:</h3>
                    <input type="text" id="filtroRegione" placeholder="Cerca regione..." oninput="filtraRegioni()">
                </div>

                <div id="opzioni2" class="options-group">
                <h3>Filtri:</h3>
                
                <div class="filtro-riga">
                    <label for="filtroTitolo">Titolo:</label>
                    <input type="text" id="filtroTitolo" placeholder="Cerca titolo..." oninput="filtraRicette()">
                </div>
                
                <div class="filtro-riga">
                    <label for="filtroTipo">Tipo:</label>
                    <select id="filtroTipo" onchange="filtraRicette()">
                        <option value="">Tutti i tipi</option>
                        <option value="antipasto">Antipasto</option>
                        <option value="primo">Primo</option>
                        <option value="secondo">Secondo</option>
                        <option value="contorno">Contorno</option>
                        <option value="dessert">Dessert</option>
                    </select>
                </div>
                
                <div class="filtro-riga">
                    <label for="filtroRegioneRicetta">Regione:</label>
                    <select id="filtroRegioneRicetta" onchange="filtraRicette()">
                        <option value="">Tutte le regioni</option>
                        <!-- Le opzioni verranno caricate dinamicamente -->
                    </select>
                </div>


                <div class="filtro-riga">
                    <label for="filtroMinLibri">Min Libri:</label>
                    <input type="number" id="filtroMinLibri" min="0" placeholder="Min" oninput="filtraRicette()">
                    
                    <label for="filtroMaxLibri">Max Libri:</label>
                    <input type="number" id="filtroMaxLibri" min="0" placeholder="Max" oninput="filtraRicette()">
                </div>
                
                <div class="filtro-riga">
                    <label for="filtroLibro">Libro:</label>
                    <select id="filtroLibro" onchange="filtraRicette()">
                        <option value="">Tutti i libri</option>
                        <!-- Opzioni caricate dinamicamente -->
                    </select>
                </div>

                <div class="filtro-riga">
                    <button id="resetFiltri" class="nav-button" onclick="resettaFiltriRicette()">
                        Resetta Filtri
                    </button>
                </div>
            </div>

                <div id="opzioni3" class="options-group">
                    <h3>Filtri per Libri:</h3>
                    
                    <div class="filtro-riga">
                        <label for="filtroISBN">ISBN:</label>
                        <input type="text" id="filtroISBN" placeholder="Cerca ISBN..." oninput="filtraLibri()">
                    </div>
                    
                    <div class="filtro-riga">
                        <label for="filtroTitoloLibro">Titolo:</label>
                        <input type="text" id="filtroTitoloLibro" placeholder="Cerca titolo..." oninput="filtraLibri()">
                    </div>
                    
                    <div class="filtro-riga">
                        <label for="filtroMinAnno">Anno Min:</label>
                        <select id="filtroMinAnno" onchange="filtraLibri()">
                            <option value="">Tutti</option>
                            <!-- Gli anni verranno caricati dinamicamente -->
                        </select>
                        
                        <label for="filtroMaxAnno">Anno Max:</label>
                        <select id="filtroMaxAnno" onchange="filtraLibri()">
                            <option value="">Tutti</option>
                            <!-- Gli anni verranno caricati dinamicamente -->
                        </select>
                    </div>

                    <div class="filtro-riga">
                        <label>Pagine:</label>
                        <div class="range-group">
                            <input type="number" id="filtroMinPagine" min="0" placeholder="Min" oninput="filtraLibri()">
                            <span>-</span>
                            <input type="number" id="filtroMaxPagine" min="0" placeholder="Max" oninput="filtraLibri()">
                        </div>
                    </div>

                    <div class="filtro-riga">
                        <label>Ricette:</label>
                        <div class="range-group">
                            <input type="number" id="filtroMinRicette" min="0" placeholder="Min" oninput="filtraLibri()">
                            <span>-</span>
                            <input type="number" id="filtroMaxRicette" min="0" placeholder="Max" oninput="filtraLibri()">
                        </div>
                    </div>

                    <div class="filtro-riga">
                        <button id="resetFiltri" class="nav-button" onclick="resettaFiltriLibri()">
                            Resetta Filtri
                        </button>
                    </div>
                </div>


            </div>
        </div>

        <div class="box sfondo grande">
            <div class="box grande" id="contenuto-dinamico">
                <div style="display:block;">
                    <div id="tabella-container">
                        <div class="scroll-container">
                            <table id="tabellaRegione" class="tabella" style="display:none;"></table>
                            <table id="tabellaRicetta" class="tabella" style="display:none;">
                                <thead>
                                    <tr>
                                        <th>Numero</th>
                                        <th>Tipo</th>
                                        <th>Titolo</th>
                                        <th>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Content will be populated dynamically -->
                                </tbody>
                            </table>
                            <table id="tabellaLibro" class="tabella" style="display:none;"></table>
                        </div>
                    </div>
                    <div id="form-libro-container">
                        <h2>Inserisci Nuovo Libro</h2>
                        <form id="formNuovoLibro">
                            <div class="form-riga">
                                <label for="nuovoISBN">ISBN:</label>
                                <input type="text" id="nuovoISBN" name="isbn" required maxlength="13">
                            </div>
                            
                            <div class="form-riga">
                                <label for="nuovoTitolo">Titolo:</label>
                                <input type="text" id="nuovoTitolo" name="titolo" required>
                            </div>
                            
                            <div class="form-riga">
                                <label for="nuovoAnno">Anno di pubblicazione:</label>
                                <input type="number" id="nuovoAnno" name="anno" min="1900" max="2099" required>
                            </div> 
                            <div class="form-azioni">
                                <button type="submit" class="nav-button">Salva Libro</button>
                                <button type="button" class="nav-button" onclick="annullaInserimento()">Annulla</button>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="box sfondo">
            <div class="box">Menu <br/>
                <nav class="nav">
                    <a href="#" class="nav-button" onclick="mostraHome()">Home</a>
                    <a href="#" class="nav-button" onclick="mostraOpzioni('opzioni1')">Regioni</a>
                    <a href="#" class="nav-button" onclick="mostraOpzioni('opzioni2')">Ricette</a>
                    <a href="#" class="nav-button" onclick="mostraOpzioni('opzioni3')">Libri</a>
                    <a href="#" class="nav-button" onclick="mostraFormLibro()">Nuovo Libro</a>
                </nav>
            </div>
        </div>
    </main>
  
    <footer class="footer">
        footer
    </footer>

    <div id="modaleModificaLibro" class="modale">
        <div class="modale-contenuto">
            <span class="chiudi">&times;</span>
            <h2>Modifica Libro</h2>
            <form id="formModificaLibro">
                <input type="hidden" id="modaleISBN" name="isbn">
                
                <div class="form-riga">
                    <label for="modaleTitolo">Titolo:</label>
                    <input type="text" id="modaleTitolo" name="titolo" required>
                </div>
                
                <div class="form-riga">
                    <label for="modaleAnno">Anno:</label>
                    <input type="number" id="modaleAnno" name="anno" min="1900" max="2099" required>
                </div>
                
                <div class="form-riga">
                    <button type="submit" class="nav-button">Salva Modifiche</button>
                    <button type="button" class="nav-button btn-elimina" id="btnEliminaLibro">Elimina Libro</button>
                </div>
            </form>
        </div>
    </div>
    <div id="modaleDettaglioRicetta" class="modale">
        <div class="modale-contenuto" style="max-width: 600px;">
            <span class="chiudi" onclick="chiudiModaleRicetta()">&times;</span>
            <h2>Dettagli Ricetta</h2>
            <div id="dettaglio-ricetta-content" style="max-height: 70vh; overflow-y: auto;"></div>
        </div>
    </div>
    <div id="modaleDettaglioLibro" class="modale">
    <div class="modale-contenuto" style="max-width: 600px;">
        <span class="chiudi" onclick="chiudiModaleLibro()">&times;</span>
        <h2>Dettagli Libro</h2>
        <div id="dettaglio-libro-content" style="max-height: 70vh; overflow-y: auto;"></div>
    </div>
</div>
</body>
</html>