<?php
include 'conn.php';

$isbn = $_GET['isbn'] ?? '';

if (empty($isbn)) {
    echo json_encode(['success' => false, 'message' => 'ISBN mancante']);
    exit;
}

// Disabilita le foreign key temporaneamente
$conn->query('SET FOREIGN_KEY_CHECKS = 0');

// Inizia transazione
$conn->begin_transaction();

try {
    // Elimina le pagine associate
    $stmt = $conn->prepare("DELETE FROM Pagina WHERE libro = ?");
    $stmt->bind_param("s", $isbn);
    $stmt->execute();
    
    // Elimina il libro
    $stmt = $conn->prepare("DELETE FROM Libro WHERE codISBN = ?");
    $stmt->bind_param("s", $isbn);
    
    if ($stmt->execute()) {
        $conn->commit();
        echo json_encode(['success' => true]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    // Riabilita le foreign key
    $conn->query('SET FOREIGN_KEY_CHECKS = 1');
    $stmt->close();
    $conn->close();
}
?>