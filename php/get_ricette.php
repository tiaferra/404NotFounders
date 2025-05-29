<?php
include 'conn.php';

$sql = "SELECT 
    R.numero,
    R.titolo,
    R.tipo,
    GROUP_CONCAT(DISTINCT Reg.nome SEPARATOR ', ') AS regioni,
    COUNT(DISTINCT RP.libro) AS numeroLibri,
    GROUP_CONCAT(DISTINCT L.titolo SEPARATOR ', ') AS titoliLibri
FROM 
    Ricetta R
LEFT JOIN RicettaRegionale RR ON R.numero = RR.ricetta
LEFT JOIN Regione Reg ON RR.regione = Reg.cod
LEFT JOIN RicettaPubblicata RP ON R.numero = RP.numeroRicetta
LEFT JOIN Libro L ON RP.libro = L.codISBN
GROUP BY R.numero
ORDER BY R.numero";

$result = $conn->query($sql);

if (!$result) {
    // Gestione errore SQL
    echo json_encode([
        "error" => "Errore nella query: " . $conn->error
    ]);
    exit;
}

$ricette = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Converti i valori null in stringhe vuote
        $row['regioni'] = $row['regioni'] ?? '';
        $row['titoliLibri'] = $row['titoliLibri'] ?? '';
        $ricette[] = $row;
    }
}

echo json_encode($ricette);

$conn->close();
?>