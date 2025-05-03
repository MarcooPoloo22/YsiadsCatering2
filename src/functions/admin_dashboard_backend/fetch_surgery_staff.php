<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Get staff with is_surgery_staff = 1 (doctors)
$sql = "SELECT id, name FROM staff WHERE is_surgery_staff = 1";

if (isset($_GET['branch_id'])) {
    $branch_id = intval($_GET['branch_id']);
    $sql .= " AND branch_id = $branch_id";
}

$result = $conn->query($sql);
$staff = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $staff[] = $row;
    }
}

echo json_encode([
    'status' => 'success',
    'data' => $staff
]);

$conn->close();
?>