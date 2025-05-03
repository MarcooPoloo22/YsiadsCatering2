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

$requiredFields = ['first_name', 'last_name', 'email', 'contact_no', 'password', 'role'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

// Validate role
$allowedRoles = ['admin', 'employee'];
if (!in_array($data['role'], $allowedRoles)) {
    echo json_encode(["error" => "Invalid role specified"]);
    exit;
}

$first_name = $conn->real_escape_string($data['first_name']);
$middle_initial = isset($data['middle_initial']) ? $conn->real_escape_string($data['middle_initial']) : null;
$last_name = $conn->real_escape_string($data['last_name']);
$email = $conn->real_escape_string($data['email']);
$contact_no = $conn->real_escape_string($data['contact_no']);
$role = $conn->real_escape_string($data['role']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$verified = 1; // Automatically verify admin-created users

$stmt = $conn->prepare("INSERT INTO users (first_name, middle_initial, last_name, email, contact_no, role, password, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssi", $first_name, $middle_initial, $last_name, $email, $contact_no, $role, $password, $verified);

if ($stmt->execute()) {
    $newId = $conn->insert_id;
    
    $getStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $getStmt->bind_param("i", $newId);
    $getStmt->execute();
    $newUser = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'users',
        null,
        $newUser,
        "Created user: " . $newUser['email']
    );

    echo json_encode(["message" => "User added successfully", "id" => $newId]);
} else {
    echo json_encode(["error" => "Error adding user: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>