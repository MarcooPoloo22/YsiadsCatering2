<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start the session
session_start();

// Debugging: Check if session is set
error_log("Session ID: " . session_id());
error_log("Session Data: " . print_r($_SESSION, true));

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

$user = $_SESSION['user']; // Safe to access user data now

// Check if the user data is complete
if (!isset($user['id']) || !isset($user['first_name']) || !isset($user['role'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid user session data']);
    exit;
}

require_once 'audit_logger.php';

$conn = new mysqli("localhost", "root", "", "asr");

// Check for DB connection errors
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Branch ID is required']);
    exit;
}

// Get existing branch data
$getStmt = $conn->prepare("SELECT * FROM branches WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldBranch = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

if (!$oldBranch) {
    echo json_encode(['status' => 'error', 'message' => 'Branch not found']);
    exit;
}

// Delete branch
$stmt = $conn->prepare("DELETE FROM branches WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // Audit trail logging
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'branches',
        $oldBranch,
        null,
        "Deleted branch: " . $oldBranch['name']
    );

    echo json_encode(['status' => 'success', 'message' => 'Branch deleted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete branch']);
}

$stmt->close();
$conn->close();
?>
