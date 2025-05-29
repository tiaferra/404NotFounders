<?php
include 'conn.php';

$data = json_decode(file_get_contents('php://input'), true);
$isbn = $data['isbn'] ?? '';
$titolo = $data['titolo'] ?? '';
$anno = $data['anno'] ?? '';

if (empty($isbn) || empty($titolo) || empty($anno)) {
    echo json_encode(['success' => false, 'message' => 'Dati mancanti']);
    exit;
}

if (strlen($isbn) !== 13) {
    echo json_encode(['success' => false, 'message' => 'ISBN deve avere 13 caratteri']);
    exit;
}

$stmt = $conn->prepare("SELECT COUNT(*) AS count FROM Libro WHERE codISBN = ?");
$stmt->bind_param("s", $isbn);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo json_encode(['success' => false, 'message' => 'ISBN già esistente']);
    exit;
}

// Modifica: rimuovi il campo numeroPagine
$sql = "INSERT INTO Libro (codISBN, titolo, anno) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $isbn, $titolo, $anno);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>