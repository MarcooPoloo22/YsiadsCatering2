<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
require_once 'audit_logger.php';

// Debug: optional logging
// error_log("SESSION: " . print_r($_SESSION, true));

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

$user = $_SESSION['user'];

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;
$name = isset($data['name']) ? trim($data['name']) : '';

if ($id <= 0 || empty($name)) {
    echo json_encode(['status' => 'error', 'message' => 'Branch ID and name are required']);
    exit;
}

// Get old data
$getOld = $conn->prepare("SELECT * FROM branches WHERE id = ?");
$getOld->bind_param("i", $id);
$getOld->execute();
$oldBranch = $getOld->get_result()->fetch_assoc();
$getOld->close();

if (!$oldBranch) {
    echo json_encode(['status' => 'error', 'message' => 'Branch not found']);
    exit;
}

$stmt = $conn->prepare("UPDATE branches SET name = ? WHERE id = ?");
$stmt->bind_param("si", $name, $id);

if ($stmt->execute()) {
    // Get new data
    
    $getNew = $conn->prepare("SELECT * FROM branches WHERE id = ?");
    $getNew->bind_param("i", $id);
    $getNew->execute();
    $newBranch = $getNew->get_result()->fetch_assoc();
    $getNew->close();
    $user = $_SESSION['user'];

    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'branches',
        $oldBranch,
        $newBranch,
        "Updated branch: " . $newBranch['name']
    );

    echo json_encode(['status' => 'success', 'message' => 'Branch updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update branch']);
}

$stmt->close();
$conn->close();
?>
