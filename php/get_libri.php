<?php
include 'conn.php';

$sql = "SELECT 
    L.codISBN,
    L.titolo,
    L.anno,
    COUNT(DISTINCT P.numeroPagina) AS numeroPagine,
    COUNT(DISTINCT RP.numeroRicetta) AS numeroRicette
FROM 
    Libro L
LEFT JOIN Pagina P ON L.codISBN = P.libro
LEFT JOIN RicettaPubblicata RP ON P.libro = RP.libro AND P.numeroPagina = RP.numeroPagina
GROUP BY 
    L.codISBN, L.titolo, L.anno;
";
$result = $conn->query($sql);

$libri = array();
while ($row = $result->fetch_assoc()) {
    $libri[] = $row;
}

echo json_encode($libri);

$conn->close();
?>
