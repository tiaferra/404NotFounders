<?php
include 'conn.php';

$sql = "SELECT /*cod,*/ nome FROM Regione";
$result = $conn->query($sql);

$regioni = array();
while ($row = $result->fetch_assoc()) {
    $regioni[] = $row;
}

echo json_encode($regioni);

$conn->close();
?>
