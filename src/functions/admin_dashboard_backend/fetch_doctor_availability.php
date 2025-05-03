<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$doctor_id = isset($_GET['doctor_id']) ? intval($_GET['doctor_id']) : 0;

if ($doctor_id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid doctor ID']);
    exit;
}

// Modified query to exclude invalid dates
$stmt = $conn->prepare("SELECT date_time FROM doctor_availability WHERE doctor_id = ? AND date_time != '0000-00-00 00:00:00'");
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$result = $stmt->get_result();

$available_slots = [];
while ($row = $result->fetch_assoc()) {
    // Additional PHP-side validation
    if ($row['date_time'] !== '0000-00-00 00:00:00') {
        $available_slots[] = $row['date_time'];
    }
}

$stmt->close();
$conn->close();

echo json_encode(['status' => 'success', 'available_slots' => $available_slots]);
?>