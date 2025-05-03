<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/error.log');


$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

try {
    if (!isset($_GET['doctor_id'])) {
        throw new Exception('Doctor ID is required');
    }

    $doctorId = (int)$_GET['doctor_id'];
    
    // Get only future availability slots
    $currentDate = date('Y-m-d'); // Changed to just date for better comparison
    
    $stmt = $conn->prepare("
        SELECT DATE_FORMAT(date_time, '%Y-%m-%d') as date, 
               DATE_FORMAT(date_time, '%H:%i') as time
        FROM doctor_availability 
        WHERE doctor_id = ? 
        AND DATE(date_time) >= ?
        ORDER BY date_time
    ");
    $stmt->bind_param("is", $doctorId, $currentDate);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $availability = [];
    while ($row = $result->fetch_assoc()) {
        // Format as "YYYY-MM-DD HH:MM:00" for consistency
        $availability[] = $row['date'] . ' ' . $row['time'] . ':00';
    }
    
    // Always return success even if empty array
    echo json_encode([
        'success' => true,
        'availability' => $availability
    ]);
    
} catch (Exception $e) {
    error_log("Error in doctor_get_availability: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>