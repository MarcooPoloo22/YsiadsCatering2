<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

if (!isset($data['id'])) {
    echo json_encode(["error" => "FAQ ID not provided"]);
    exit;
}

$id = (int)$data['id'];

// Get FAQ data before deletion
$getStmt = $conn->prepare("SELECT * FROM faqs WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldFaq = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

if (!$oldFaq) {
    echo json_encode(["error" => "FAQ not found"]);
    exit;
}

$sql = "DELETE FROM faqs WHERE id = $id";

if ($conn->query($sql)) {
    // Log audit trail
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'faqs',
        $oldFaq,
        null,
        "Deleted FAQ: " . $oldFaq['question']
    );

    echo json_encode(["message" => "FAQ deleted successfully"]);
} else {
    echo json_encode(["error" => "Error deleting FAQ: " . $conn->error]);
}

$conn->close();
?>