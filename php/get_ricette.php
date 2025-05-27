<?php
include 'conn.php';

$sql = "SELECT numero, tipo, titolo FROM Ricetta";
$result = $conn->query($sql);

$ricette = array();
while ($row = $result->fetch_assoc()) {
    $ricette[] = $row;
}

echo json_encode($ricette);

$conn->close();
?>
