<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$doctorId = $_GET['doctor_id'] ?? null;
if (!$doctorId) {
    echo json_encode(['status' => 'error', 'message' => 'Doctor ID is required']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "asr");
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Connection failed: " . $conn->connect_error]));
}

$stmt = $conn->prepare("SELECT available_slots FROM doctor_availability WHERE doctor_id = ?");
$stmt->bind_param("i", $doctorId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'success', 'time_slots' => []]);
} else {
    $row = $result->fetch_assoc();
    $slots = json_decode($row['available_slots'], true) ?? [];
    echo json_encode(['status' => 'success', 'time_slots' => $slots]);
}

$stmt->close();
$conn->close();
?>