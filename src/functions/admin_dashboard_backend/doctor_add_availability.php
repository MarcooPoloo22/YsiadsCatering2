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

// Check if slot already exists
$checkStmt = $conn->prepare("SELECT id FROM doctor_availability WHERE doctor_id = ? AND date_time = ?");
$checkStmt->bind_param("is", $doctorId, $dateTime);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'This time slot already exists']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO doctor_availability (doctor_id, date_time) VALUES (?, ?)");
$stmt->bind_param("is", $doctorId, $dateTime);

if ($stmt->execute()) {
    // Log the action
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'doctor_availability',
        null,
        ['doctor_id' => $doctorId, 'date_time' => $dateTime],
        "Added availability slot for doctor $doctorId at $dateTime"
    );
    
    echo json_encode(['status' => 'success', 'message' => 'Availability slot added successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add availability slot']);
}

$stmt->close();
$conn->close();
?>