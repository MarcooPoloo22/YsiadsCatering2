<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
$branch_id = isset($_GET['branch_id']) ? $_GET['branch_id'] : null;

$query = "SELECT id, name FROM staff";
if ($branch_id) {
    $query .= " WHERE branch_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $branch_id);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query($query);
}

$staff = array();
while($row = $result->fetch_assoc()) {
    $staff[] = $row;
}

echo json_encode($staff);
?>