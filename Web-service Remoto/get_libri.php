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

$sql = "SELECT 
    L.codISBN,
    L.titolo,
    L.anno,
    (SELECT COUNT(*) FROM Pagina WHERE libro = L.codISBN) AS numeroPagine,
    (SELECT COUNT(DISTINCT numeroRicetta) FROM RicettaPubblicata WHERE libro = L.codISBN) AS numeroRicette
FROM 
    Libro L
GROUP BY 
    L.codISBN, L.titolo, L.anno;";

$result = $conn->query($sql);

$libri = array();
while ($row = $result->fetch_assoc()) {
    $libri[] = $row;
}

echo json_encode($libri);

$conn->close();
?>