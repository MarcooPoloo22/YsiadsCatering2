<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "User is not logged in."]);
    exit;
}

require_once 'audit_logger.php';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !is_numeric($data['id'])) {
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

$id = (int)$data['id'];
$allowedFields = ['first_name', 'middle_initial', 'last_name', 'email', 'contact_no', 'role'];
$updates = [];
$params = [];
$types = '';
$passwordChanged = false;

foreach ($allowedFields as $field) {
    if (isset($data[$field])) {
        $updates[] = "$field = ?";
        $params[] = $data[$field];
        $types .= 's';
    }
}

// Handle password separately
if (isset($data['password']) && !empty(trim($data['password']))) {
    if (strlen($data['password']) < 8) {
        echo json_encode(["error" => "Password must be at least 8 characters"]);
        exit;
    }
    $updates[] = "password = ?";
    $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    $types .= 's';
    $passwordChanged = true;
}

if (empty($updates)) {
    echo json_encode(["error" => "No valid fields to update"]);
    exit;
}

$getStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldUser = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

if (!$oldUser) {
    echo json_encode(["error" => "User not found"]);
    exit;
}

$sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
$params[] = $id;
$types .= 'i';

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $getStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $getStmt->bind_param("i", $id);
    $getStmt->execute();
    $newUser = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Prepare data for audit trail
    $oldData = $oldUser;
    $newData = $newUser;
    
    // Don't expose password hashes in audit trail
    unset($oldData['password']);
    unset($newData['password']);
    
    // Customize the action message if password was changed
    $actionMessage = "Updated user: " . $newUser['email'];
    if ($passwordChanged) {
        $actionMessage = "Updated user (including password): " . $newUser['email'];
    }

    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'users',
        $oldData,
        $newData,
        $actionMessage
    );

    echo json_encode(["message" => "User updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating user: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>