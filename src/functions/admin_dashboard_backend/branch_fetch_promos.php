<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins (for development)
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow necessary HTTP methods
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

// Fetch promos
$sql = "SELECT id, name FROM promos";
$result = $conn->query($sql);

$promos = [];
while ($row = $result->fetch_assoc()) {
    $promos[] = $row;
}

echo json_encode($promos);

$conn->close();
?>
