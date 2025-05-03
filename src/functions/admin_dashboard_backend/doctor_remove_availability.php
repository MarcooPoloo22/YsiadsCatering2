<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'audit_logger.php';
session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$doctorId = $data['doctor_id'] ?? null;
$dateTime = $data['date_time'] ?? null;

if (!$doctorId || !$dateTime) {
    echo json_encode(['status' => 'error', 'message' => 'Doctor ID and date/time are required']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Connection failed: " . $conn->connect_error]));
}

// Handle wildcard for date-only removal
if (str_ends_with($dateTime, '%')) {
    $date = str_replace('%', '', $dateTime);
    $stmt = $conn->prepare("DELETE FROM doctor_availability WHERE doctor_id = ? AND date_time LIKE ?");
    $stmt->bind_param("is", $doctorId, $dateTime);
} else {
    $stmt = $conn->prepare("DELETE FROM doctor_availability WHERE doctor_id = ? AND date_time = ?");
    $stmt->bind_param("is", $doctorId, $dateTime);
}

if ($stmt->execute()) {
    // Log the action
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'doctor_availability',
        ['doctor_id' => $doctorId, 'date_time' => $dateTime],
        null,
        "Removed availability slot for doctor $doctorId at $dateTime"
    );
    
    echo json_encode(['status' => 'success', 'message' => 'Availability slot removed successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to remove availability slot']);
}

$stmt->close();
$conn->close();
?>