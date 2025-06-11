<?php
include 'conn.php';

$isbn = $_GET['isbn'] ?? '';

$query = "SELECT r.numero, r.titolo, r.tipo 
          FROM Ricetta r
          JOIN RicettaPubblicata rp ON r.numero = rp.numeroRicetta
          WHERE rp.libro = '$isbn'";

$result = $conn->query($query);

$ricette = [];
while ($row = $result->fetch_assoc()) {
    $ricette[] = $row;
}

echo json_encode($ricette);
?>