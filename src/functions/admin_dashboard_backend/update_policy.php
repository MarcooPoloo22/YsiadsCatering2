<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized access"]);
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

$input = json_decode(file_get_contents("php://input"), true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($input['privacy_policy']) || !isset($input['terms_condition'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

try {
    // Check existing data
    $checkStmt = $conn->prepare("SELECT COUNT(*) as count, privacy_policy, terms_condition FROM site_policies");
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result()->fetch_assoc();
    $count = $checkResult['count'];
    $oldData = $count > 0 ? $checkResult : null;

    // Update or Insert
    if ($count > 0) {
        $stmt = $conn->prepare("UPDATE site_policies SET privacy_policy = ?, terms_condition = ?");
    } else {
        $stmt = $conn->prepare("INSERT INTO site_policies (privacy_policy, terms_condition) VALUES (?, ?)");
    }
    
    $stmt->bind_param("ss", $input['privacy_policy'], $input['terms_condition']);
    $stmt->execute();
    
    // Get updated data
    $getNewStmt = $conn->prepare("SELECT * FROM site_policies LIMIT 1");
    $getNewStmt->execute();
    $newData = $getNewStmt->get_result()->fetch_assoc();

    // Audit logging
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        $count > 0 ? 'UPDATE' : 'CREATE',
        'site_policies',
        $oldData,
        $newData,
        ($count > 0 ? "Updated" : "Created") . " site policies"
    );

    echo json_encode(["message" => "Policies updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

$conn->close();
?>