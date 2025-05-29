<?php
include 'conn.php';

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