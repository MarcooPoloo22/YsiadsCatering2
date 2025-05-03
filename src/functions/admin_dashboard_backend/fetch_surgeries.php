<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Add this line

// Handle preflight OPTIONS request
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

$sql = "SELECT s.*, 
        GROUP_CONCAT(DISTINCT sb.branch_id) AS branch_ids, 
        GROUP_CONCAT(DISTINCT ss.staff_id) AS staff_ids 
        FROM surgeries s
        LEFT JOIN surgery_branches sb ON s.id = sb.surgery_id
        LEFT JOIN surgery_staff ss ON s.id = ss.surgery_id
        GROUP BY s.id";

$result = $conn->query($sql);
$surgeries = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['branch_ids'] = $row['branch_ids'] ? explode(",", $row['branch_ids']) : [];
        $row['staff_ids'] = $row['staff_ids'] ? explode(",", $row['staff_ids']) : [];
        $surgeries[] = $row;
    }
}

echo json_encode($surgeries);
$conn->close();
?>