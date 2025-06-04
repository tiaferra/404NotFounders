<?php
include 'conn.php';

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