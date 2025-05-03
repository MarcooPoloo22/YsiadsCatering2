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

// Get ID from either JSON body or query parameter
$id = null;
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Try to get from JSON body first
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data && isset($data['id'])) {
        $id = $data['id'];
    } 
    // If not in JSON body, try from query string
    else if (isset($_GET['id'])) {
        $id = $_GET['id'];
    }
}

if (!$id || !is_numeric($id)) {
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

$id = (int)$id;

$getStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$getStmt->bind_param("i", $id);
$getStmt->execute();
$oldUser = $getStmt->get_result()->fetch_assoc();
$getStmt->close();

if (!$oldUser) {
    echo json_encode(["error" => "User not found"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // Remove sensitive data before logging
    unset($oldUser['password']);
    
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'users',
        $oldUser,
        null,
        "Deleted user: " . $oldUser['email']
    );

    echo json_encode(["message" => "User deleted successfully"]);
} else {
    echo json_encode(["error" => "Error deleting user: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>