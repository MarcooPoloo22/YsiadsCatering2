<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    echo json_encode(['error' => 'User is not logged in.']);
    exit;
}

require_once 'audit_logger.php';

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input data.']);
    exit();
}

$id = intval($data['id']);

// Get existing appointment
$getStmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldAppointment = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

if (!$oldAppointment) {
    http_response_code(404);
    echo json_encode(['error' => 'Appointment not found.']);
    exit();
}

// Delete appointment
$stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // Log audit trail
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'bookings',
        $oldAppointment,
        null,
        "Deleted appointment for: " . $oldAppointment['email']
    );

    echo json_encode(['message' => 'Appointment deleted successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete appointment.']);
}

$stmt->close();
$conn->close();
?>