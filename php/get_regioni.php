<?php
include 'conn.php';

$sql = "SELECT cod,
    R.nome AS nome,
    COUNT(RR.ricetta) AS NumeroRicette
FROM
    Regione AS R
JOIN
    RicettaRegionale AS RR
ON
    R.cod = RR.regione
GROUP BY
    R.nome
ORDER BY
    nome ASC;";
$result = $conn->query($sql);

$regioni = array();
while ($row = $result->fetch_assoc()) {
    $regioni[] = $row;
}

echo json_encode($regioni);

$conn->close();
?>
