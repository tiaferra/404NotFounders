<?php
include 'conn.php';
header('Content-Type: application/json');

$sql = "SELECT * FROM Ricetta";
$result = $conn->query($sql);

$ricette = [];
while($row = $result->fetch_assoc()) {
    $ricette[] = $row;
}

echo json_encode($ricette);
?>