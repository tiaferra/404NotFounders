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

$numeroRicetta = $_GET['numero'] ?? null;

if (!$numeroRicetta) {
    echo json_encode(['error' => 'Numero ricetta mancante']);
    exit;
}

$sql = "SELECT ingrediente, quantità 
        FROM Ingrediente 
        WHERE numeroRicetta = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $numeroRicetta);
$stmt->execute();
$result = $stmt->get_result();

$ingredienti = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ingredienti[] = $row;
    }
}

echo json_encode($ingredienti);

$stmt->close();
$conn->close();
?>