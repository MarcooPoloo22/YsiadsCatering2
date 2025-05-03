<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to count total services
$sql = "SELECT COUNT(*) as total_services FROM services";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $totalServices = $row['total_services'];
} else {
    $totalServices = 0;
}

// Return the total count as JSON
echo json_encode(["total_services" => $totalServices]);

$conn->close();
?>