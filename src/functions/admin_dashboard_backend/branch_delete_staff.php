<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000"); // Update this to match your frontend origin
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once 'audit_logger.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/error.log'); // Adjust if needed

// Log session to debug if user not found
error_log("SESSION: " . print_r($_SESSION, true));

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Staff ID is required']);
    exit;
}

// Get existing staff data before deleting
$getStmt = $conn->prepare("SELECT * FROM staff WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldStaff = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

if (!$oldStaff) {
    echo json_encode(['status' => 'error', 'message' => 'Staff not found']);
    exit;
}

// Delete staff
$stmt = $conn->prepare("DELETE FROM staff WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'staff',
        $oldStaff,
        null,
        "Deleted staff: " . $oldStaff['name']
    );

    echo json_encode(['status' => 'success', 'message' => 'Staff deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete staff']);
}

$stmt->close();
$conn->close();
?>
