<?php
include 'conn.php';

$titolo = $_GET['titolo'] ?? '';

if (empty($titolo)) {
    echo json_encode(['error' => 'Titolo mancante']);
    exit;
}

$sql = "SELECT * FROM Libro WHERE titolo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $titolo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $libro = $result->fetch_assoc();
    echo json_encode($libro);
} else {
    echo json_encode(null);
}

$stmt->close();
$conn->close();
?>