<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["message" => "User is not logged in."]);
    exit();
}   
$user = $_SESSION['user'];

require_once 'audit_logger.php';

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "asr";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get the raw JSON input (expecting JSON data in PUT request)
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input data."]);
    exit();
}

$phone     = trim($data["phone"] ?? "");
$facebook  = trim($data["facebook"] ?? "");
$instagram = trim($data["instagram"] ?? "");
$twitter   = trim($data["twitter"] ?? "");

if (empty($phone) || empty($facebook) || empty($instagram) || empty($twitter)) {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields."]);
    exit();
}

// Retrieve the existing contact information for audit logging
$stmt_old = $conn->prepare("SELECT * FROM contact_info LIMIT 1");
if (!$stmt_old) {
    echo json_encode(["message" => "Failed to prepare statement: " . $conn->error]);
    exit();
}
$stmt_old->execute();
$result_old = $stmt_old->get_result();
$oldContact = $result_old->fetch_assoc();
$stmt_old->close();

if (!$oldContact) {
    echo json_encode(["message" => "No contact information found."]);
    exit();
}

// Update the contact_info table using a prepared statement
$stmt_update = $conn->prepare("UPDATE contact_info SET phone = ?, facebook = ?, instagram = ?, twitter = ?");
if (!$stmt_update) {
    echo json_encode(["message" => "Failed to prepare update statement: " . $conn->error]);
    exit();
}
$stmt_update->bind_param("ssss", $phone, $facebook, $instagram, $twitter);
if (!$stmt_update->execute()) {
    echo json_encode(["message" => "Failed to update contact information: " . $stmt_update->error]);
    $stmt_update->close();
    exit();
}
$stmt_update->close();

// Retrieve the updated contact information for audit logging
$stmt_new = $conn->prepare("SELECT * FROM contact_info LIMIT 1");
if (!$stmt_new) {
    echo json_encode(["message" => "Failed to prepare statement: " . $conn->error]);
    exit();
}
$stmt_new->execute();
$newContact = $stmt_new->get_result()->fetch_assoc();
$stmt_new->close();

// Log the audit trail with action "UPDATE" (using your audit_logger.php function)
// The function call signature: logAuditTrail($conn, $user_id, $user_name, $user_role, $action_type, $table_name, $old_value, $new_value, $description)
logAuditTrail(
    $conn,
    $user['id'],
    $user['first_name'],
    $user['role'],
    'UPDATE',
    'contact_info',
    $oldContact,
    $newContact,
    "Updated contact information"
);

echo json_encode(["message" => "Contact information updated successfully"]);
$conn->close();
?>
