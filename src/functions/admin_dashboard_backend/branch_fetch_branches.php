<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000"); // Explicitly allow requests from the frontend
header("Access-Control-Allow-Credentials: true"); // Allow credentials (cookies)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// Database connection
$conn = new mysqli("localhost", "root", "", "asr");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Fetch branches
$sql = "SELECT id, name FROM branches";
$result = $conn->query($sql);
$branches = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $branches[] = $row;
    }
}
echo json_encode($branches);

$conn->close();
?>