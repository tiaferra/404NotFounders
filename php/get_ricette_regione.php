<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include 'conn.php';

$codRegione = $_GET['codRegione'] ?? '';
error_log("codRegione ricevuto: " . $codRegione);

// Query corretta per ottenere le ricette di una regione
$query = "SELECT r.numero, r.titolo, r.tipo 
          FROM Ricetta r
          JOIN RicettaRegionale rr ON r.numero = rr.ricetta
          WHERE rr.regione = ?";  // Uso di prepared statement

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $codRegione);
$stmt->execute();
$result = $stmt->get_result();

$ricette = [];
while ($row = $result->fetch_assoc()) {
    $ricette[] = $row;
}

echo json_encode($ricette);

$stmt->close();
$conn->close();
?>