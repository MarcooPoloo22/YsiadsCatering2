<?php
header("Content-Type: application/json; charset=UTF-8");

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $threeYearsAgo = date('Y-m-d H:i:s', strtotime('-3 years'));
    
    $conn->beginTransaction();
    
    $stmt = $conn->prepare("
        INSERT INTO bookings_archive 
        SELECT *, NULL as archived_at FROM bookings 
        WHERE created_at < :threeYearsAgo
    ");
    $stmt->bindParam(':threeYearsAgo', $threeYearsAgo);
    $stmt->execute();
    $archivedCount = $stmt->rowCount();
    
    $stmt = $conn->prepare("
        DELETE FROM bookings 
        WHERE created_at < :threeYearsAgo
    ");
    $stmt->bindParam(':threeYearsAgo', $threeYearsAgo);
    $stmt->execute();
    $deletedCount = $stmt->rowCount();
    
    $stmt = $conn->prepare("
        UPDATE bookings_archive 
        SET archived_at = NOW() 
        WHERE archived_at IS NULL
    ");
    $stmt->execute();
    
    $conn->commit();
    
    echo json_encode([
        'status' => 'success',
        'message' => "Archiving completed successfully.",
        'archived_records' => $archivedCount,
        'deleted_records' => $deletedCount
    ]);
    
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}