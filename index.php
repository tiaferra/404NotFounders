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
            <div class="box">Tabelle<br>
                <form>
                <p>Seleziona un'opzione:</p>
                <label>
                    <input type="radio" name="scelta" value="opzione1" onclick="mostraOpzioni('opzioni1')">
                    Regione
                </label><br>
                <label>
                    <input type="radio" name="scelta" value="opzione2" onclick="mostraOpzioni('opzioni2')">
                    Ricetta
                </label><br>
                <label>
                    <input type="radio" name="scelta" value="opzione3" onclick="mostraOpzioni('opzioni3')">
                   Libro
                </label>
                </form>

                <div id="opzioni1" class="options-group">
                    <h3>Opzioni per Pallino 1:</h3>
                    <input type="checkbox" id="opt1a"><label for="opt1a" class="checkbox-label">Opzione 1A</label>
                    <input type="checkbox" id="opt1b"><label for="opt1b" class="checkbox-label">Opzione 1B</label>
                    <input type="checkbox" id="opt1c"><label for="opt1c" class="checkbox-label">Opzione 1C</label>
                    <input type="checkbox" id="opt1d"><label for="opt1d" class="checkbox-label">Opzione 1D</label>
                </div>

                <div id="opzioni2" class="options-group">
                    <h3>Opzioni per Pallino 2:</h3>
                    <input type="checkbox" id="opt2a"><label for="opt2a" class="checkbox-label">Opzione 2A</label>
                    <input type="checkbox" id="opt2b"><label for="opt2b" class="checkbox-label">Opzione 2B</label>
                    <input type="checkbox" id="opt2c"><label for="opt2c" class="checkbox-label">Opzione 2C</label>
                    <input type="checkbox" id="opt2d"><label for="opt2d" class="checkbox-label">Opzione 2D</label>
                </div>

                <div id="opzioni3" class="options-group">
                    <h3>Opzioni per Pallino 3:</h3>
                    <input type="checkbox" id="opt3a"><label for="opt3a" class="checkbox-label">Opzione 3A</label>
                    <input type="checkbox" id="opt3b"><label for="opt3b" class="checkbox-label">Opzione 3B</label>
                    <input type="checkbox" id="opt3c"><label for="opt3c" class="checkbox-label">Opzione 3C</label>
                    <input type="checkbox" id="opt3d"><label for="opt3d" class="checkbox-label">Opzione 3D</label>
                </div>


            </div>
        </div>

         <div class="box sfondo grande">
            <div class="box grande">Contenuto<br/>

                <table id="tabellaRegione" class="tabella" style="display:none;"></table>
                <table id="tabellaRicetta" class="tabella" style="display:none;"></table>
                <table id="tabellaLibro" class="tabella" style="display:none;"></table>

                <!-- Tabella per Opzione 1 
                    <div id="tabella1" class="tabella" style="display: none;">
                    <h3>Tabella Regione</h3>
                    <table>
                        <thead>
                        <tr><th>Cod</th><th>Nome</th></tr>
                        </thead>
                        <tbody>
                        <tr><td>01</td><td>Lombardia</td></tr>
                        <tr><td>02</td><td>Veneto</td></tr>
                        </tbody>
                    </table>
                    </div>

                     Tabella per Opzione 2 
                    <div id="tabella2" class="tabella" style="display: none;">
                    <h3>Tabella Ricetta</h3>
                    <table>
                        <thead>
                        <tr><th>Numero</th><th>Tipo</th><th>Titolo</th></tr>
                        </thead>
                        <tbody>
                        <tr><td>001</td><td>Primo</td><td>Lasagne</td></tr>
                        <tr><td>002</td><td>Dolce</td><td>Tiramisu</td></tr>
                        </tbody>
                    </table>
                    </div>

                     Tabella per Opzione 3 
                    <div id="tabella3" class="tabella" style="display: none;">
                    <h3>Tabella Libro</h3>
                    <table>
                        <thead>
                        <tr><th>CodISBN</th><th>Titolo</th><th>Anno</th></tr>
                        </thead>
                        <tbody>
                        <tr><td>9781234567890</td><td>Ricette Facili</td><td>2020</td></tr>
                        <tr><td>9780987654321</td><td>Cucina Italiana</td><td>2022</td></tr>
                        </tbody>
                    </table>
                    </div>-->

            </div>
         </div>

        <div class="box sfondo">
            <div class="box">Menu <br/>
                <nav class="nav">
                    <a href="#" class="nav-button">Home</a>
                    <a href="#" class="nav-button">Libri</a>
                    <a href="#" class="nav-button">Ricette</a>
                </nav>
            </div>

        </div>
    </main>
  
    <footer class="footer">
        footer
    </footer>

</body>
</html>