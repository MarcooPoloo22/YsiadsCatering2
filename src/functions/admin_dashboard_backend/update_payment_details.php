<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "User is not logged in."]);
    exit();
}
$user = $_SESSION['user'];

require_once 'audit_logger.php';

$servername   = "localhost";
$dbUsername   = "root";
$dbPassword   = "";
$dbname       = "asr";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get the raw JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid input data."]);
    exit();
}

// Validate required fields
$requiredFields = [
    'gcash_number', 'gcash_name',
    'paymaya_number', 'paymaya_name',
    'bank_name', 'bank_account_number', 'bank_account_name'
];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required field: $field"]);
        exit();
    }
}

$gcash_number        = $data['gcash_number'];
$gcash_name          = $data['gcash_name'];
$paymaya_number      = $data['paymaya_number'];
$paymaya_name        = $data['paymaya_name'];
$bank_name           = $data['bank_name'];
$bank_account_number = $data['bank_account_number'];
$bank_account_name   = $data['bank_account_name'];

// Use subquery workaround to update the "latest" row in payment_details
$updateSql = "
    UPDATE payment_details SET
        gcash_number = ?,
        gcash_name = ?,
        paymaya_number = ?,
        paymaya_name = ?,
        bank_name = ?,
        bank_account_number = ?,
        bank_account_name = ?
    WHERE id = (
        SELECT id FROM (SELECT id FROM payment_details ORDER BY id DESC LIMIT 1) AS temp
    )
";

// Retrieve the old record for audit logging
$stmt_old = $conn->prepare("SELECT * FROM payment_details ORDER BY id DESC LIMIT 1");
$stmt_old->execute();
$oldRecordResult = $stmt_old->get_result();
$oldRecord = $oldRecordResult->fetch_assoc();
$stmt_old->close();

$stmt = $conn->prepare($updateSql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param(
    "sssssss",
    $gcash_number,
    $gcash_name,
    $paymaya_number,
    $paymaya_name,
    $bank_name,
    $bank_account_number,
    $bank_account_name
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update payment details: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Retrieve the updated record for audit logging
$stmt_new = $conn->prepare("SELECT * FROM payment_details ORDER BY id DESC LIMIT 1");
$stmt_new->execute();
$newRecord = $stmt_new->get_result()->fetch_assoc();
$stmt_new->close();

// Log the audit trail with action "UPDATE"
logAuditTrail(
    $conn,
    $user['id'],
    $user['first_name'],
    $user['role'],
    'UPDATE',
    'payment_details',
    $oldRecord,
    $newRecord,
    "Updated payment details"
);

echo json_encode(["status" => "success", "message" => "Payment details updated successfully"]);
$conn->close();
?>