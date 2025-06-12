<?php
include 'conn.php';

$numero = $_GET['numero'] ?? '';

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
WHERE R.numero = ?
GROUP BY R.numero";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $numero);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $row['regioni'] = $row['regioni'] ?? '';
    $row['titoliLibri'] = $row['titoliLibri'] ?? '';
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Ricetta non trovata"]);
}

$conn->close();
?>