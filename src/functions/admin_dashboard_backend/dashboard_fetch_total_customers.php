<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("message" => "Connection failed: " . $conn->connect_error));
    exit();
}

// Query to count customers
$sql = "SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(array(
        "total_customers" => $row['total_customers']
    ));
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No customers found."));
}

$conn->close();
?>