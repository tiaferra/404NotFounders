<?php
header('Content-Type: application/json');

include 'conn.php';

// Query per ottenere le ricette con le regioni associate
$sql = "SELECT r.numero, r.titolo, r.tipo, GROUP_CONCAT(re.nome) AS regioni 
        FROM Ricetta r
        LEFT JOIN RicettaRegionale rr ON r.numero = rr.ricetta
        LEFT JOIN Regione re ON rr.regione = re.cod
        GROUP BY r.numero";

$result = $conn->query($sql);

$ricette = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $ricette[] = $row;
    }
}

$conn->close();

echo json_encode($ricette);
?>