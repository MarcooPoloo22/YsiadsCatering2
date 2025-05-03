<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if (!isset($data['question']) || !isset($data['answer'])) {
    echo json_encode(["error" => "Invalid data received"]);
    exit;
}

$question = $conn->real_escape_string($data['question']);
$answer = $conn->real_escape_string($data['answer']);

$sql = "INSERT INTO faqs (question, answer) VALUES ('$question', '$answer')";

if ($conn->query($sql)) {
    $newId = $conn->insert_id;
    
    // Get the created FAQ
    $getStmt = $conn->prepare("SELECT * FROM faqs WHERE id = ?");
    $getStmt->bind_param("i", $newId);
    $getStmt->execute();
    $newFaq = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Log audit trail
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'faqs',
        null,
        $newFaq,
        "Created FAQ: " . $newFaq['question']
    );

    echo json_encode(["message" => "FAQ added successfully"]);
} else {
    echo json_encode(["error" => "Error adding FAQ: " . $conn->error]);
}

$conn->close();
?>