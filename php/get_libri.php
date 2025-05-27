<?php
include 'conn.php';

$sql = "SELECT codISBN, titolo, anno FROM Libro";
$result = $conn->query($sql);

$libri = array();
while ($row = $result->fetch_assoc()) {
    $libri[] = $row;
}

echo json_encode($libri);

$conn->close();
?>
