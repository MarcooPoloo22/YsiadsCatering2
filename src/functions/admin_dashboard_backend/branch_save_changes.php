<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and preflight OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow required headers

// Handle preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$conn = new mysqli("localhost", "root", "", "asr");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$requiredFields = ['type', 'item_id', 'branch_id', 'staff_id', 'duration'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        die(json_encode(["status" => "error", "message" => "Missing required field: $field"]));
    }
}

// Prepare and execute query
$stmt = $conn->prepare("INSERT INTO appointments (type, item_id, branch_id, staff_id, duration) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("siiii", $data['type'], $data['item_id'], $data['branch_id'], $data['staff_id'], $data['duration']);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "appointment_id" => $stmt->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
