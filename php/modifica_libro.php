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

$sql = "UPDATE Libro SET titolo = ?, anno = ? WHERE codISBN = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sis", $titolo, $anno, $isbn);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>