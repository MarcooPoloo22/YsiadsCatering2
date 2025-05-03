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

// Get the raw PUT data (expecting JSON)
$data = json_decode(file_get_contents("php://input"), true);

// Debug: log what data is received
error_log("Data received: " . print_r($data, true));

if (!isset($data['id']) || !isset($data['question']) || !isset($data['answer'])) {
    echo json_encode(["error" => "Required fields not provided"]);
    exit;
}

$id = (int)$data['id'];
$question = $conn->real_escape_string($data['question']);
$answer = $conn->real_escape_string($data['answer']);

// Get old FAQ data for audit logging
$getStmt = $conn->prepare("SELECT * FROM faqs WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldFaq = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

$sql = "UPDATE faqs SET question = '$question', answer = '$answer' WHERE id = $id";

if ($conn->query($sql)) {
    // Get updated FAQ data for audit logging
    $getStmt = $conn->prepare("SELECT * FROM faqs WHERE id = ?");
    $getStmt->bind_param("i", $id);
    $getStmt->execute();
    $newFaq = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Retrieve user details from session (assumes user array contains id, first_name, and role)
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'faqs',
        $oldFaq,
        $newFaq,
        "Updated FAQ: " . $newFaq['question']
    );

    echo json_encode(["message" => "FAQ updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating FAQ: " . $conn->error]);
}

$conn->close();
?>
