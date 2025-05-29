<?php
include 'conn.php';

$sql = "SELECT 
    R.numero,
    R.titolo,
    R.tipo,
    Reg.nome AS regione,
    COUNT(DISTINCT RP.libro) AS numeroLibri,
    GROUP_CONCAT(DISTINCT L.titolo SEPARATOR ', ') AS titoliLibri
FROM 
    Ricetta R
LEFT JOIN 
    RicettaRegionale RR ON R.numero = RR.ricetta
LEFT JOIN 
    Regione Reg ON RR.regione = Reg.cod
LEFT JOIN 
    RicettaPubblicata RP ON R.numero = RP.numeroRicetta
LEFT JOIN 
    Libro L ON RP.libro = L.codISBN
GROUP BY 
    R.numero, R.titolo, R.tipo, Reg.nome
ORDER BY 
    R.numero;

";

$result = $conn->query($sql);

$ricette = array();
while ($row = $result->fetch_assoc()) {
    $ricette[] = $row;
}

echo json_encode($ricette);

$conn->close();
?>
