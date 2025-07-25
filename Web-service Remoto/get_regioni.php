<?php
include 'conn.php';

// Imposta l'intestazione per indicare che la risposta è JSON
header('Content-Type: application/json');

// Gestione delle richieste OPTIONS (utile per CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

// Consenti richieste GET da qualsiasi origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

$sql = "SELECT cod,
    R.nome AS nome,
    COUNT(RR.ricetta) AS NumeroRicette
FROM
    Regione AS R
JOIN
    RicettaRegionale AS RR
ON
    R.cod = RR.regione
GROUP BY
    R.nome
ORDER BY
    nome ASC;";
$result = $conn->query($sql);

$regioni = array();
while ($row = $result->fetch_assoc()) {
    $regioni[] = $row;
}

echo json_encode($regioni);

$conn->close();
?>
