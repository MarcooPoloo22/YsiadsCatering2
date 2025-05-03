<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

require_once 'audit_logger.php';

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$name = isset($data['name']) ? trim($data['name']) : '';

if (empty($name)) {
    echo json_encode(['status' => 'error', 'message' => 'Branch name is required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO branches (name) VALUES (?)");
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;

    $getStmt = $conn->prepare("SELECT * FROM branches WHERE id = ?");
    $getStmt->bind_param("i", $newId);
    $getStmt->execute();
    $newBranch = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    $user = $_SESSION['user'];

    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'branches',
        null,
        $newBranch,
        "Created branch: " . $newBranch['name']
    );

    echo json_encode([
        'status' => 'success',
        'id' => $newId,
        'message' => 'Branch added successfully'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to add branch'
    ]);
}

$stmt->close();
$conn->close();
?>
