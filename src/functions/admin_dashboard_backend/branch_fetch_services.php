<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow GET and preflight OPTIONS
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow necessary headers

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

// Fetch services
$sql = "SELECT id, name FROM services";
$result = $conn->query($sql);

$services = [];
while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}

echo json_encode($services);

$conn->close();
?>
