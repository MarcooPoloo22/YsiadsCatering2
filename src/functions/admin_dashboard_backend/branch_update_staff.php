<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
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
ini_set('error_log', 'C:/xampp/htdocs/error.log');

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$name = $data['name'] ?? '';
$is_surgery_staff = isset($data['is_surgery_staff']) ? (int)$data['is_surgery_staff'] : 0;

if (empty($id)) {
    echo json_encode(['status' => 'error', 'message' => 'Staff ID is required']);
    exit;
}

// Get current staff data for audit logging
$getStmt = $conn->prepare("SELECT * FROM staff WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldStaff = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

// Update staff
$stmt = $conn->prepare("UPDATE staff SET name = ?, is_surgery_staff = ? WHERE id = ?");
$stmt->bind_param("sii", $name, $is_surgery_staff, $id);

if ($stmt->execute()) {
    // If changing to doctor (is_surgery_staff = 1) and wasn't before, create availability entry
    if ($is_surgery_staff == 1 && (!$oldStaff || $oldStaff['is_surgery_staff'] == 0)) {
        $checkStmt = $conn->prepare("SELECT 1 FROM doctor_availability WHERE doctor_id = ?");
        $checkStmt->bind_param("i", $id);
        $checkStmt->execute();
        
        if ($checkStmt->get_result()->num_rows === 0) {
            $createStmt = $conn->prepare("INSERT INTO doctor_availability (doctor_id) VALUES (?)");
            $createStmt->bind_param("i", $id);
            $createStmt->execute();
            $createStmt->close();
        }
        $checkStmt->close();
    }

    // Get updated staff for audit logging
    $getStmt = $conn->prepare("SELECT * FROM staff WHERE id = ?");
    $getStmt->bind_param("i", $id);
    $getStmt->execute();
    $newStaff = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Log the change
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'staff',
        $oldStaff,
        $newStaff,
        "Updated staff: " . $newStaff['name']
    );

    echo json_encode([
        'status' => 'success', 
        'message' => 'Staff updated successfully',
        'is_surgery_staff' => $is_surgery_staff
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update staff']);
}

$stmt->close();
$conn->close();
?>