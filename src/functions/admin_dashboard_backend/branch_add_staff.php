<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once 'audit_logger.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/error.log');

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? '';
$branch_id = $data['branch_id'] ?? '';
$is_surgery_staff = isset($data['is_surgery_staff']) ? (int)$data['is_surgery_staff'] : 0;

if (empty($name) || empty($branch_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Staff name and branch ID are required']);
    exit;
}

// Insert staff with is_surgery_staff
$stmt = $conn->prepare("INSERT INTO staff (name, branch_id, is_surgery_staff) VALUES (?, ?, ?)");
$stmt->bind_param("sii", $name, $branch_id, $is_surgery_staff);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;

    // If this is surgery staff (doctor), create availability slots table entry
    if ($is_surgery_staff) {
        $createSlots = $conn->prepare("INSERT INTO doctor_availability (doctor_id) VALUES (?)");
        $createSlots->bind_param("i", $newId);
        $createSlots->execute();
        $createSlots->close();
    }

    // Retrieve the newly added staff
    $getStmt = $conn->prepare("SELECT * FROM staff WHERE id = ?");
    $getStmt->bind_param("i", $newId);
    $getStmt->execute();
    $newStaff = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Use session data to log
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'staff',
        null,
        $newStaff,
        "Created staff: " . $newStaff['name'] . " (Surgery Staff: " . $is_surgery_staff . ")"
    );

    echo json_encode([
        'status' => 'success', 
        'id' => $newId, 
        'message' => 'Staff added successfully',
        'is_surgery_staff' => $is_surgery_staff
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add staff']);
}

$stmt->close();
$conn->close();
?>